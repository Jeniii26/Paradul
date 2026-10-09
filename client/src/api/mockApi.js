/**
 * paradu'l — Local Storage API
 * Provides simulated asynchronous persistence for clothing, outfits, schedules, and wear records.
 */

import {
  SAMPLE_CLOTHING,
  SAMPLE_OUTFITS,
  SAMPLE_SCHEDULES,
  SAMPLE_WEAR_RECORDS,
} from './sampleData.js';
import { processLaundryExpiration, applyWearToClothingLaundry } from '../services/laundryService.js';

// Storage keys
const KEYS = {
  CLOTHING: 'paradul:clothing',
  OUTFITS: 'paradul:outfits',
  SCHEDULES: 'paradul:schedules',
  WEAR_RECORDS: 'paradul:wear_records',
};

// Simulated network latency
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic storage reader with JSON error recovery
 */
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Corrupted localStorage key "${key}". Resetting to fallback.`, err);
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

/**
 * Generic storage writer
 */
function writeStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

// Clothing API

/**
 * Lists all clothing items with automatic laundry expiration checks
 */
export async function listClothing() {
  await delay();
  const rawItems = readStorage(KEYS.CLOTHING, SAMPLE_CLOTHING);

  // Business rule: Automatic expiration check when loading data
  const { updatedItems, hasChanges } = processLaundryExpiration(rawItems);
  if (hasChanges) {
    writeStorage(KEYS.CLOTHING, updatedItems);
  }

  return updatedItems;
}

export async function getClothing(id) {
  await delay();
  const items = await listClothing();
  const found = items.find((item) => String(item.id) === String(id));
  if (!found) throw new Error(`Clothing item with ID ${id} not found.`);
  return found;
}

export async function createClothing(input) {
  await delay();
  const items = await listClothing();
  const newItem = {
    ...input,
    id: input.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    laundryStatus: input.laundryStatus || 'available',
    laundryUntil: input.laundryUntil || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...items];
  writeStorage(KEYS.CLOTHING, updated);
  return newItem;
}

export async function updateClothing(id, updates) {
  await delay();
  const items = await listClothing();
  const index = items.findIndex((item) => String(item.id) === String(id));
  if (index === -1) throw new Error(`Clothing item with ID ${id} not found.`);

  const updatedItem = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  items[index] = updatedItem;
  writeStorage(KEYS.CLOTHING, items);
  return updatedItem;
}

export async function deleteClothing(id) {
  await delay();
  const items = await listClothing();
  const filtered = items.filter((item) => String(item.id) !== String(id));
  writeStorage(KEYS.CLOTHING, filtered);
  return { success: true, id };
}

// Outfits API

export async function listOutfits() {
  await delay();
  return readStorage(KEYS.OUTFITS, SAMPLE_OUTFITS);
}

export async function getOutfit(id) {
  await delay();
  const outfits = await listOutfits();
  const found = outfits.find((o) => String(o.id) === String(id));
  if (!found) throw new Error(`Outfit with ID ${id} not found.`);
  return found;
}

export async function createOutfit(input) {
  await delay();
  if (!input.topId || !input.bottomId || !input.shoesId) {
    throw new Error('An outfit must contain exactly 1 Top, 1 Bottom, and 1 Shoes.');
  }

  const outfits = await listOutfits();
  const newOutfit = {
    ...input,
    id: input.id || `outfit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newOutfit, ...outfits];
  writeStorage(KEYS.OUTFITS, updated);
  return newOutfit;
}

export async function updateOutfit(id, updates) {
  await delay();
  const outfits = await listOutfits();
  const index = outfits.findIndex((o) => String(o.id) === String(id));
  if (index === -1) throw new Error(`Outfit with ID ${id} not found.`);

  const updatedOutfit = {
    ...outfits[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  outfits[index] = updatedOutfit;
  writeStorage(KEYS.OUTFITS, outfits);
  return updatedOutfit;
}

export async function deleteOutfit(id) {
  await delay();
  const outfits = await listOutfits();
  // Deleting an outfit does not delete its clothing items
  const filtered = outfits.filter((o) => String(o.id) !== String(id));
  writeStorage(KEYS.OUTFITS, filtered);
  return { success: true, id };
}

// Calendar & Schedules API

export async function listSchedules() {
  await delay();
  const schedules = readStorage(KEYS.SCHEDULES, SAMPLE_SCHEDULES);
  return schedules.slice().sort((a, b) => b.date.localeCompare(a.date));
}

export async function createSchedule(input) {
  await delay();
  if (!input.outfitId || !input.date) {
    throw new Error('A scheduled outfit requires both an outfit selection and a date.');
  }

  const schedules = await listSchedules();
  const newSchedule = {
    ...input,
    id: input.id || `sched_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: input.status || 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newSchedule, ...schedules];
  writeStorage(KEYS.SCHEDULES, updated);
  return newSchedule;
}

export async function updateSchedule(id, updates) {
  await delay();
  const schedules = await listSchedules();
  const index = schedules.findIndex((s) => String(s.id) === String(id));
  if (index === -1) throw new Error(`Schedule event with ID ${id} not found.`);

  const updatedSchedule = {
    ...schedules[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  schedules[index] = updatedSchedule;
  writeStorage(KEYS.SCHEDULES, schedules);
  return updatedSchedule;
}

export async function deleteSchedule(id) {
  await delay();
  const schedules = await listSchedules();
  const filtered = schedules.filter((s) => String(s.id) !== String(id));
  writeStorage(KEYS.SCHEDULES, filtered);
  return { success: true, id };
}

/**
 * Marks a scheduled outfit as worn, creates a wear record,
 * and moves tops & bottoms into 7-day laundry.
 */
export async function markScheduleWorn(scheduleId) {
  await delay();
  const schedules = await listSchedules();
  const schedule = schedules.find((s) => String(s.id) === String(scheduleId));
  if (!schedule) throw new Error(`Schedule ${scheduleId} not found.`);

  const wearDate = schedule.date || new Date().toISOString().split('T')[0];

  // 1. Update schedule status
  schedule.status = 'worn';
  schedule.updatedAt = new Date().toISOString();
  writeStorage(KEYS.SCHEDULES, schedules);

  // 2. Append wear record
  const wearRecords = readStorage(KEYS.WEAR_RECORDS, SAMPLE_WEAR_RECORDS);
  const newWearRecord = {
    id: `wear_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    outfitId: schedule.outfitId,
    wornDate: wearDate,
    createdAt: new Date().toISOString(),
  };
  const updatedWearRecords = [newWearRecord, ...wearRecords];
  writeStorage(KEYS.WEAR_RECORDS, updatedWearRecords);

  // 3. Apply 7-day laundry to Top and Bottom
  const outfits = await listOutfits();
  const outfit = outfits.find((o) => String(o.id) === String(schedule.outfitId));

  let updatedClothing = [];
  if (outfit) {
    const clothingItems = await listClothing();
    updatedClothing = applyWearToClothingLaundry(outfit, clothingItems, wearDate);
    writeStorage(KEYS.CLOTHING, updatedClothing);
  }

  return {
    schedule,
    wearRecord: newWearRecord,
    updatedClothing,
  };
}

// Wear Records API

export async function listWearRecords() {
  await delay();
  return readStorage(KEYS.WEAR_RECORDS, SAMPLE_WEAR_RECORDS);
}

export async function logWearRecord(outfitId, wornDate = new Date().toISOString().split('T')[0]) {
  await delay();
  const records = await listWearRecords();
  const newRecord = {
    id: `wear_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    outfitId,
    wornDate,
    createdAt: new Date().toISOString(),
  };

  const updated = [newRecord, ...records];
  writeStorage(KEYS.WEAR_RECORDS, updated);
  return newRecord;
}

// Reset Demo Data

export async function resetDemoData() {
  await delay();
  localStorage.setItem(KEYS.CLOTHING, JSON.stringify(SAMPLE_CLOTHING));
  localStorage.setItem(KEYS.OUTFITS, JSON.stringify(SAMPLE_OUTFITS));
  localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(SAMPLE_SCHEDULES));
  localStorage.setItem(KEYS.WEAR_RECORDS, JSON.stringify(SAMPLE_WEAR_RECORDS));
  return {
    clothing: SAMPLE_CLOTHING,
    outfits: SAMPLE_OUTFITS,
    schedules: SAMPLE_SCHEDULES,
    wearRecords: SAMPLE_WEAR_RECORDS,
  };
}
