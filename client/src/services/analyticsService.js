/**
 * paradu'l — Wardrobe Analytics Service
 *
 * Encapsulates all data aggregation, usage counters, wardrobe valuation,
 * and style metrics calculations outside the UI components.
 *
 * IMPORTANT BUSINESS RULES:
 * 1. Clothing usage counters are strictly derived from confirmed wear logs
 *    (WearRecords), NOT merely from saved or scheduled outfits.
 * 2. Wardrobe valuation sums active individual clothing items exactly once,
 *    preventing double-counting items that exist in multiple saved outfits.
 */

/**
 * Calculates the Top 3 most worn clothing items.
 *
 * Algorithm:
 * 1. For each wear record, locate the corresponding outfit.
 * 2. Retrieve the IDs for the top, bottom, and shoes of that outfit.
 * 3. Accumulate wear counts per clothing item.
 * 4. Sort descending and return the top 3 items with their counts.
 *
 * @param {Array<Object>} clothingItems
 * @param {Array<Object>} outfits
 * @param {Array<Object>} wearRecords
 * @param {number} [limit=3]
 * @returns {Array<{ item: Object, wearCount: number }>}
 */
/**
 * Calculates wear count map for all clothing items from confirmed wear records.
 * @param {Array<Object>} outfits
 * @param {Array<Object>} wearRecords
 * @returns {Map<string, number>} Map of clothingId (string) -> wear count
 */
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

/**
 * Calculates the most frequently worn outfit.
 *
 * Algorithm:
 * 1. Group wear records by outfitId.
 * 2. Count occurrences of each outfit.
 * 3. Find the outfit with the maximum wear count.
 *
 * @param {Array<Object>} outfits
 * @param {Array<Object>} wearRecords
 * @returns {{ outfit: Object, wearCount: number } | null}
 */
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

/**
 * Calculates the most frequently worn color in outfits.
 *
 * Algorithm:
 * 1. For each confirmed wear record, lookup its outfit.
 * 2. For each piece (top, bottom, shoes) in that outfit, retrieve its color.
 * 3. Count occurrences across all worn pieces.
 * 4. Return the color with the highest usage count.
 *
 * @param {Array<Object>} clothingItems
 * @param {Array<Object>} outfits
 * @param {Array<Object>} wearRecords
 * @returns {{ color: string, count: number } | null}
 */
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

/**
 * Calculates the total market value of the wardrobe.
 * Sums the price of every active clothing item exactly once.
 *
 * @param {Array<Object>} clothingItems
 * @returns {number} Sum of clothing prices in standard currency unit (₱)
 */
export function getTotalWardrobeValue(clothingItems) {
  return clothingItems.reduce((sum, item) => {
    const price = Number(item.price);
    return sum + (Number.isFinite(price) && price > 0 ? price : 0);
  }, 0);
}

/**
 * Returns category distribution statistics
 * @param {Array<Object>} clothingItems
 * @returns {{ top: number, bottom: number, shoes: number, total: number }}
 */
export function getCategoryBreakdown(clothingItems) {
  const counts = { top: 0, bottom: 0, shoes: 0, total: clothingItems.length };
  for (const item of clothingItems) {
    if (counts[item.category] !== undefined) {
      counts[item.category]++;
    }
  }
  return counts;
}

/**
 * Returns current laundry status breakdown
 * @param {Array<Object>} clothingItems
 * @returns {{ available: number, inLaundry: number }}
 */
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
