/**
 * paradu'l — Laundry Management Service
 *
 * Centralizes all laundry state transitions, 7-day automatic wear schedules,
 * expiration checks, and manual overrides.
 *
 * BUSINESS RULES:
 * 1. An outfit marked as 'worn' automatically places its Top and Bottom into laundry
 *    for exactly 7 days from the wear date.
 * 2. Shoes are NOT automatically marked for laundry when an outfit is worn, but
 *    can be manually moved in or out of laundry.
 * 3. When currentDate >= laundryUntil, the clothing item's effective status
 *    reverts to 'available'.
 * 4. Users can manually toggle any item between 'available' and 'in_laundry' at any time.
 */

const LAUNDRY_DURATION_DAYS = 7;

/**
 * Adds days to a date string (YYYY-MM-DD or ISO) and returns ISO YYYY-MM-DD
 * @param {string|Date} dateInput
 * @param {number} days
 * @returns {string}
 */
export function addDays(dateInput, days) {
  const d = new Date(dateInput);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Checks and updates any items whose laundry period has expired.
 * This runs whenever clothing items are loaded, avoiding the need for
 * a cron daemon or background server process.
 *
 * @param {Array<Object>} clothingItems
 * @param {Date} [referenceDate] Optional override date for testing
 * @returns {{ updatedItems: Array<Object>, hasChanges: boolean }}
 */
export function processLaundryExpiration(clothingItems, referenceDate = new Date()) {
  let hasChanges = false;
  const todayStr = referenceDate.toISOString().split('T')[0];

  const updatedItems = clothingItems.map((item) => {
    // Only items marked 'in_laundry' with an expiration date are candidates
    if (item.laundryStatus === 'in_laundry' && item.laundryUntil) {
      if (todayStr >= item.laundryUntil) {
        hasChanges = true;
        return {
          ...item,
          laundryStatus: 'available',
          laundryUntil: null,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    return item;
  });

  return { updatedItems, hasChanges };
}

/**
 * Updates clothing items when an outfit is marked as worn.
 * Places Top and Bottom in laundry for 7 days. Shoes remain unchanged.
 *
 * @param {Object} outfit The outfit that was worn ({ topId, bottomId, shoesId })
 * @param {Array<Object>} clothingItems Current clothing catalog
 * @param {string} wearDate ISO date string YYYY-MM-DD
 * @returns {Array<Object>} Updated clothing catalog
 */
export function applyWearToClothingLaundry(outfit, clothingItems, wearDate) {
  const laundryUntil = addDays(wearDate, LAUNDRY_DURATION_DAYS);
  const now = new Date().toISOString();

  // Top and bottom IDs subject to 7-day automatic laundry
  const automatedLaundryIds = new Set([outfit.topId, outfit.bottomId].filter(Boolean));

  return clothingItems.map((item) => {
    if (automatedLaundryIds.has(item.id)) {
      return {
        ...item,
        laundryStatus: 'in_laundry',
        laundryUntil,
        updatedAt: now,
      };
    }
    // Shoes and other items remain unaffected by automatic wear laundry
    return item;
  });
}

/**
 * Manually toggles a single item between 'available' and 'in_laundry'.
 * Manual user actions explicitly override automatic schedules.
 *
 * @param {Object} item
 * @returns {Object} Updated clothing item
 */
export function toggleItemLaundryStatus(item) {
  const isCurrentlyInLaundry = item.laundryStatus === 'in_laundry';
  const now = new Date().toISOString();

  if (isCurrentlyInLaundry) {
    // Manual mark as Available: clears the laundry schedule
    return {
      ...item,
      laundryStatus: 'available',
      laundryUntil: null,
      updatedAt: now,
    };
  } else {
    // Manual mark as In Laundry: sets a default 7-day cleaning period
    const defaultUntil = addDays(new Date(), LAUNDRY_DURATION_DAYS);
    return {
      ...item,
      laundryStatus: 'in_laundry',
      laundryUntil: defaultUntil,
      updatedAt: now,
    };
  }
}

/**
 * Formats remaining laundry days for user display
 * @param {string|null} laundryUntil
 * @returns {string} e.g. "Available in 3 days" or "In Laundry"
 */
export function formatLaundryTimeRemaining(laundryUntil) {
  if (!laundryUntil) return 'In Laundry';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const until = new Date(laundryUntil);
  until.setHours(0, 0, 0, 0);

  const diffTime = until.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Ready for collection';
  if (diffDays === 1) return 'Ready tomorrow';
  return `Ready in ${diffDays} days (${laundryUntil})`;
}
