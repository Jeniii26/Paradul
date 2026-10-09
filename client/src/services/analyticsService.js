/**
 * paradu'l — Wardrobe Analytics Service
 *
 * Computes wardrobe usage metrics, valuations, and style statistics.
 *
 * Rules:
 * - Wear counts are derived strictly from confirmed wear records (WearRecords).
 * - Wardrobe valuation counts each piece once without duplicating pieces across outfits.
 */

// Calculates wear count map for all clothing items from confirmed wear records.
export function getClothingWearCountsMap(outfits = [], wearRecords = []) {
  const outfitMap = new Map((outfits || []).map((o) => [String(o.id), o]));
  const wearCounts = new Map();

  for (const record of (wearRecords || [])) {
    const outfit = outfitMap.get(String(record.outfitId));
    if (!outfit) continue;

    const itemIds = [outfit.topId, outfit.bottomId, outfit.shoesId].filter(Boolean);
    for (const id of itemIds) {
      const key = String(id);
      wearCounts.set(key, (wearCounts.get(key) || 0) + 1);
    }
  }

  return wearCounts;
}

// Returns the top N most worn clothing items.
export function getTopUsedClothing(clothingItems, outfits, wearRecords, limit = 3) {
  const wearCounts = getClothingWearCountsMap(outfits, wearRecords);
  const clothingMap = new Map((clothingItems || []).map((c) => [String(c.id), c]));

  const results = [];
  for (const [id, count] of wearCounts.entries()) {
    const item = clothingMap.get(id);
    if (item) {
      results.push({ item, wearCount: count });
    }
  }

  return results
    .sort((a, b) => b.wearCount - a.wearCount)
    .slice(0, limit);
}

// Returns the outfit with the highest confirmed wear count.
export function getTopOutfit(outfits, wearRecords) {
  if (!wearRecords || wearRecords.length === 0) return null;

  const counts = new Map();
  for (const record of wearRecords) {
    const key = String(record.outfitId);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  let topOutfitId = null;
  let maxCount = 0;

  for (const [outfitId, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      topOutfitId = outfitId;
    }
  }

  if (!topOutfitId || maxCount === 0) return null;

  const outfit = outfits.find((o) => String(o.id) === topOutfitId);
  if (!outfit) return null;

  return { outfit, wearCount: maxCount };
}

// Determines the most worn color across all pieces in confirmed outfits.
export function getTopColor(clothingItems, outfits, wearRecords) {
  if (!wearRecords || wearRecords.length === 0) return null;

  const outfitMap = new Map(outfits.map((o) => [String(o.id), o]));
  const clothingMap = new Map(clothingItems.map((c) => [String(c.id), c]));
  const colorCounts = new Map();

  for (const record of wearRecords) {
    const outfit = outfitMap.get(String(record.outfitId));
    if (!outfit) continue;

    const itemIds = [outfit.topId, outfit.bottomId, outfit.shoesId].filter(Boolean);
    for (const id of itemIds) {
      const item = clothingMap.get(String(id));
      if (item && item.color) {
        const normalized = item.color.trim();
        colorCounts.set(normalized, (colorCounts.get(normalized) || 0) + 1);
      }
    }
  }

  let topColor = null;
  let maxCount = 0;

  for (const [color, count] of colorCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      topColor = color;
    }
  }

  if (!topColor) return null;

  return { color: topColor, count: maxCount };
}

// Sums the price of every active clothing item counted once in Philippine Pesos (₱).
export function getTotalWardrobeValue(clothingItems) {
  return clothingItems.reduce((sum, item) => {
    const price = Number(item.price);
    return sum + (Number.isFinite(price) && price > 0 ? price : 0);
  }, 0);
}

// Counts pieces by category (top, bottom, shoes).
export function getCategoryBreakdown(clothingItems) {
  const counts = { top: 0, bottom: 0, shoes: 0, total: clothingItems.length };
  for (const item of clothingItems) {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
  }
  return counts;
}

// Calculates counts of clean vs in-laundry items.
export function getLaundryBreakdown(clothingItems) {
  let available = 0;
  let inLaundry = 0;
  for (const item of clothingItems) {
    if (item.laundryStatus === 'in_laundry') {
      inLaundry++;
    } else {
      available++;
    }
  }
  return { available, inLaundry };
}
