/**
 * paradu'l — Supabase Database & Storage API
 * Integrates directly with Supabase PostgreSQL tables and Storage buckets.
 */

import { supabase } from './supabaseClient.js';
import { SAMPLE_CLOTHING, SAMPLE_OUTFITS, SAMPLE_SCHEDULES, SAMPLE_WEAR_RECORDS } from './sampleData.js';
import { processLaundryExpiration, addDays } from '../services/laundryService.js';

/**
 * Gets the current authenticated user ID or throws an informative error
 */
async function getAuthUserId() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('You must be signed in to perform this action.');
  }
  return user.id;
}

// Data Converters (PostgreSQL snake_case <-> Application camelCase)

function clothingFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.image_url,
    originalImageUrl: row.original_image_url || row.image_url,
    category: row.category,
    color: row.color,
    price: Number(row.price) || 0,
    style: row.style || 'Casual',
    laundryStatus: row.laundry_status || 'available',
    laundryUntil: row.laundry_until ? String(row.laundry_until).split('T')[0] : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function clothingToRow(item, userId) {
  return {
    name: item.name,
    image_url: item.imageUrl,
    original_image_url: item.originalImageUrl || item.imageUrl,
    category: item.category,
    color: item.color,
    price: Number(item.price) || 0,
    style: item.style || 'Casual',
    laundry_status: item.laundryStatus || 'available',
    laundry_until: item.laundryUntil || null,
    user_id: userId,
    updated_at: new Date().toISOString(),
  };
}

function outfitFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    topId: row.top_id,
    bottomId: row.bottom_id,
    shoesId: row.shoes_id,
    style: row.style || 'Casual',
    colorTheme: row.color_theme || '',
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function outfitToRow(outfit, userId) {
  return {
    name: outfit.name,
    top_id: outfit.topId,
    bottom_id: outfit.bottomId,
    shoes_id: outfit.shoesId,
    style: outfit.style || 'Casual',
    color_theme: outfit.colorTheme || null,
    notes: outfit.notes || null,
    user_id: userId,
    updated_at: new Date().toISOString(),
  };
}

function scheduleFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    outfitId: row.outfit_id,
    date: row.date ? String(row.date).split('T')[0] : '',
    occasion: row.occasion || 'Casual',
    notes: row.notes || '',
    status: row.status || 'scheduled',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function scheduleToRow(sched, userId) {
  return {
    outfit_id: sched.outfitId,
    date: sched.date,
    occasion: sched.occasion || 'Casual',
    notes: sched.notes || null,
    status: sched.status || 'scheduled',
    user_id: userId,
    updated_at: new Date().toISOString(),
  };
}

function wearRecordFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    outfitId: row.outfit_id,
    wornDate: row.worn_date ? String(row.worn_date).split('T')[0] : '',
    createdAt: row.created_at,
  };
}

// Supabase Cloud Storage Helper

/**
 * Uploads an image (data URL or blob) to the 'clothing-images' Supabase Storage bucket.
 * If the bucket doesn't exist yet, falls back gracefully to returning the data URL.
 */
async function uploadToStorageIfPossible(imageUrlOrDataUrl, userId) {
  if (!imageUrlOrDataUrl || !imageUrlOrDataUrl.startsWith('data:image')) {
    return imageUrlOrDataUrl; // Already a remote URL or SVG
  }

  try {
    // Convert base64 dataUrl to Blob
    const res = await fetch(imageUrlOrDataUrl);
    const blob = await res.blob();
    const ext = blob.type === 'image/jpeg' ? 'jpg' : 'png';
    const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('clothing-images')
      .upload(filePath, blob, {
        contentType: blob.type,
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload bypassed (using data URL fallback):', uploadError.message);
      return imageUrlOrDataUrl;
    }

    const { data: publicUrlData } = supabase.storage
      .from('clothing-images')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || imageUrlOrDataUrl;
  } catch (err) {
    console.warn('Storage upload encountered an error, falling back to data URL:', err);
    return imageUrlOrDataUrl;
  }
}

// Clothing API

export async function listClothing() {
  const userId = await getAuthUserId();

  const { data, error } = await supabase
    .from('clothing_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase listClothing error:', error);
    throw new Error(error.message);
  }

  let items = (data || []).map(clothingFromRow);

  // Business rule: Automatic expiration check when loading data
  const { updatedItems, hasChanges } = processLaundryExpiration(items);
  if (hasChanges) {
    // Asynchronously sync expired items back to Supabase
    for (const item of updatedItems) {
      if (item.laundryStatus === 'available' && !item.laundryUntil) {
        supabase
          .from('clothing_items')
          .update({ laundry_status: 'available', laundry_until: null })
          .eq('id', item.id)
          .then();
      }
    }
  }

  return updatedItems;
}

export async function getClothing(id) {
  const userId = await getAuthUserId();

  const { data, error } = await supabase
    .from('clothing_items')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !data) throw new Error(`Clothing item ${id} not found.`);
  return clothingFromRow(data);
}

export async function createClothing(input) {
  const userId = await getAuthUserId();

  // Upload image to Supabase Storage if it's a data URL
  const publicImageUrl = await uploadToStorageIfPossible(input.imageUrl, userId);
  const rowData = clothingToRow({ ...input, imageUrl: publicImageUrl }, userId);

  const { data, error } = await supabase
    .from('clothing_items')
    .insert([rowData])
    .select()
    .single();

  if (error) {
    console.error('Supabase createClothing error:', error);
    throw new Error(error.message);
  }

  return clothingFromRow(data);
}

export async function updateClothing(id, updates) {
  const userId = await getAuthUserId();

  const patch = {};
  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.category !== undefined) patch.category = updates.category;
  if (updates.color !== undefined) patch.color = updates.color;
  if (updates.price !== undefined) patch.price = Number(updates.price) || 0;
  if (updates.style !== undefined) patch.style = updates.style;
  if (updates.laundryStatus !== undefined) patch.laundry_status = updates.laundryStatus;
  if (updates.laundryUntil !== undefined) patch.laundry_until = updates.laundryUntil;
  if (updates.imageUrl !== undefined) patch.image_url = updates.imageUrl;
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('clothing_items')
    .update(patch)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return clothingFromRow(data);
}

export async function deleteClothing(id) {
  const userId = await getAuthUserId();

  const { error } = await supabase
    .from('clothing_items')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return { success: true, id };
}

// Outfits API

export async function listOutfits() {
  const userId = await getAuthUserId();

  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(outfitFromRow);
}

export async function getOutfit(id) {
  const userId = await getAuthUserId();

  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !data) throw new Error(`Outfit ${id} not found.`);
  return outfitFromRow(data);
}

export async function createOutfit(input) {
  const userId = await getAuthUserId();

  if (!input.topId || !input.bottomId || !input.shoesId) {
    throw new Error('An outfit must contain exactly 1 Top, 1 Bottom, and 1 Shoes.');
  }

  const rowData = outfitToRow(input, userId);

  const { data, error } = await supabase
    .from('outfits')
    .insert([rowData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return outfitFromRow(data);
}

export async function updateOutfit(id, updates) {
  const userId = await getAuthUserId();

  const patch = {};
  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.topId !== undefined) patch.top_id = updates.topId;
  if (updates.bottomId !== undefined) patch.bottom_id = updates.bottomId;
  if (updates.shoesId !== undefined) patch.shoes_id = updates.shoesId;
  if (updates.style !== undefined) patch.style = updates.style;
  if (updates.colorTheme !== undefined) patch.color_theme = updates.colorTheme;
  if (updates.notes !== undefined) patch.notes = updates.notes;
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('outfits')
    .update(patch)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return outfitFromRow(data);
}

export async function deleteOutfit(id) {
  const userId = await getAuthUserId();

  const { error } = await supabase
    .from('outfits')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return { success: true, id };
}

// Calendar & Schedules API

export async function listSchedules() {
  const userId = await getAuthUserId();

  const { data, error } = await supabase
    .from('outfit_schedules')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(scheduleFromRow);
}

export async function createSchedule(input) {
  const userId = await getAuthUserId();

  if (!input.outfitId || !input.date) {
    throw new Error('A scheduled outfit requires both an outfit selection and a date.');
  }

  const rowData = scheduleToRow(input, userId);

  const { data, error } = await supabase
    .from('outfit_schedules')
    .insert([rowData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return scheduleFromRow(data);
}

export async function updateSchedule(id, updates) {
  const userId = await getAuthUserId();

  const patch = {};
  if (updates.outfitId !== undefined) patch.outfit_id = updates.outfitId;
  if (updates.date !== undefined) patch.date = updates.date;
  if (updates.occasion !== undefined) patch.occasion = updates.occasion;
  if (updates.notes !== undefined) patch.notes = updates.notes;
  if (updates.status !== undefined) patch.status = updates.status;
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('outfit_schedules')
    .update(patch)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return scheduleFromRow(data);
}

export async function deleteSchedule(id) {
  const userId = await getAuthUserId();

  const { error } = await supabase
    .from('outfit_schedules')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return { success: true, id };
}

/**
 * Confirms an outfit was worn.
 * Updates schedule to 'worn', inserts a wear_record, and triggers 7-day laundry on top & bottom.
 */
export async function markScheduleWorn(scheduleId) {
  const userId = await getAuthUserId();

  // 1. Fetch the schedule
  const { data: schedRow, error: schedError } = await supabase
    .from('outfit_schedules')
    .select('*')
    .eq('id', scheduleId)
    .eq('user_id', userId)
    .single();

  if (schedError || !schedRow) throw new Error(`Schedule ${scheduleId} not found.`);

  const wearDate = schedRow.date || new Date().toISOString().split('T')[0];

  // 2. Mark schedule as worn
  const { data: updatedSchedRow, error: updateError } = await supabase
    .from('outfit_schedules')
    .update({ status: 'worn', updated_at: new Date().toISOString() })
    .eq('id', scheduleId)
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  // 3. Insert wear record
  const { data: wearRow, error: wearError } = await supabase
    .from('wear_records')
    .insert([{
      outfit_id: schedRow.outfit_id,
      worn_date: wearDate,
      user_id: userId,
    }])
    .select()
    .single();

  if (wearError) throw new Error(wearError.message);

  // 4. Update Top and Bottom laundry status in clothing_items
  const { data: outfitRow } = await supabase
    .from('outfits')
    .select('*')
    .eq('id', schedRow.outfit_id)
    .single();

  let updatedClothing = [];
  if (outfitRow) {
    const laundryUntil = addDays(wearDate, 7);
    const topId = outfitRow.top_id;
    const bottomId = outfitRow.bottom_id;

    if (topId) {
      await supabase
        .from('clothing_items')
        .update({ laundry_status: 'in_laundry', laundry_until: laundryUntil })
        .eq('id', topId)
        .eq('user_id', userId);
    }

    if (bottomId) {
      await supabase
        .from('clothing_items')
        .update({ laundry_status: 'in_laundry', laundry_until: laundryUntil })
        .eq('id', bottomId)
        .eq('user_id', userId);
    }

    updatedClothing = await listClothing();
  }

  return {
    schedule: scheduleFromRow(updatedSchedRow),
    wearRecord: wearRecordFromRow(wearRow),
    updatedClothing,
  };
}

// Wear Records API

export async function listWearRecords() {
  const userId = await getAuthUserId();

  const { data, error } = await supabase
    .from('wear_records')
    .select('*')
    .eq('user_id', userId)
    .order('worn_date', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(wearRecordFromRow);
}

export async function logWearRecord(outfitId, wornDate = new Date().toISOString().split('T')[0]) {
  const userId = await getAuthUserId();

  const { data, error } = await supabase
    .from('wear_records')
    .insert([{
      outfit_id: outfitId,
      worn_date: wornDate,
      user_id: userId,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return wearRecordFromRow(data);
}

// Demo Seed & Reset

export async function resetDemoData() {
  const userId = await getAuthUserId();

  // Clear existing items for this user
  await supabase.from('wear_records').delete().eq('user_id', userId);
  await supabase.from('outfit_schedules').delete().eq('user_id', userId);
  await supabase.from('outfits').delete().eq('user_id', userId);
  await supabase.from('clothing_items').delete().eq('user_id', userId);

  // Insert sample clothing
  const idMap = new Map();
  const createdItems = [];

  for (const item of SAMPLE_CLOTHING) {
    const row = clothingToRow(item, userId);
    const { data } = await supabase.from('clothing_items').insert([row]).select().single();
    if (data) {
      idMap.set(item.id, data.id);
      createdItems.push(clothingFromRow(data));
    }
  }

  // Insert sample outfits using mapped new IDs
  const createdOutfits = [];
  const outfitIdMap = new Map();

  for (const outfit of SAMPLE_OUTFITS) {
    const mappedTopId = idMap.get(outfit.topId);
    const mappedBottomId = idMap.get(outfit.bottomId);
    const mappedShoesId = idMap.get(outfit.shoesId);

    if (mappedTopId && mappedBottomId && mappedShoesId) {
      const row = outfitToRow({
        ...outfit,
        topId: mappedTopId,
        bottomId: mappedBottomId,
        shoesId: mappedShoesId,
      }, userId);

      const { data } = await supabase.from('outfits').insert([row]).select().single();
      if (data) {
        outfitIdMap.set(outfit.id, data.id);
        createdOutfits.push(outfitFromRow(data));
      }
    }
  }

  // Insert sample schedules
  const createdSchedules = [];
  for (const sched of SAMPLE_SCHEDULES) {
    const mappedOutfitId = outfitIdMap.get(sched.outfitId);
    if (mappedOutfitId) {
      const row = scheduleToRow({ ...sched, outfitId: mappedOutfitId }, userId);
      const { data } = await supabase.from('outfit_schedules').insert([row]).select().single();
      if (data) createdSchedules.push(scheduleFromRow(data));
    }
  }

  // Insert sample wear records
  const createdWear = [];
  for (const wear of SAMPLE_WEAR_RECORDS) {
    const mappedOutfitId = outfitIdMap.get(wear.outfitId);
    if (mappedOutfitId) {
      const { data } = await supabase.from('wear_records').insert([{
        outfit_id: mappedOutfitId,
        worn_date: wear.wornDate,
        user_id: userId,
      }]).select().single();
      if (data) createdWear.push(wearRecordFromRow(data));
    }
  }

  return {
    clothing: createdItems,
    outfits: createdOutfits,
    schedules: createdSchedules,
    wearRecords: createdWear,
  };
}
