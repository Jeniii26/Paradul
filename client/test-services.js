/**
 * paradu'l — Automated Test Verification Suite
 *
 * Verifies core business rules, service logic, data persistence,
 * laundry expiration calculations, and analytics aggregations.
 */

import assert from 'node:assert';
import {
  addDays,
  processLaundryExpiration,
  applyWearToClothingLaundry,
  toggleItemLaundryStatus,
  formatLaundryTimeRemaining,
} from './src/services/laundryService.js';

import {
  getTopUsedClothing,
  getTopOutfit,
  getTopColor,
  getTotalWardrobeValue,
  getCategoryBreakdown,
  getLaundryBreakdown,
} from './src/services/analyticsService.js';

import {
  isValidEmail,
  DEMO_USER,
} from './src/services/authService.js';

console.log('--- Starting paradu\'l Test Suite ---');

let passedTests = 0;
let totalTests = 0;

function it(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`  ✓ ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(err);
  }
}

// ============================================================================
// 1. AUTH SERVICE TESTS
// ============================================================================
console.log('\n[1. Authentication Service]');

it('validates email formats accurately', () => {
  assert.strictEqual(isValidEmail('demo@paradul.com'), true);
  assert.strictEqual(isValidEmail('user.name+tag@example.co.uk'), true);
  assert.strictEqual(isValidEmail('invalid-email'), false);
  assert.strictEqual(isValidEmail('missing@domain'), false);
  assert.strictEqual(isValidEmail(''), false);
});

it('has demo user credentials defined', () => {
  assert.strictEqual(DEMO_USER.email, 'demo@paradul.com');
  assert.ok(DEMO_USER.name);
});

// ============================================================================
// 2. LAUNDRY SERVICE & 7-DAY WEAR RULES
// ============================================================================
console.log('\n[2. Laundry Service & Business Rules]');

it('addDays accurately calculates future dates across months', () => {
  const base = '2026-09-27';
  const target = addDays(base, 7);
  assert.strictEqual(target, '2026-10-04');
});

it('automatically marks Top and Bottom as in_laundry for 7 days upon wear, leaving Shoes untouched', () => {
  const mockClothing = [
    { id: 'top-1', category: 'top', laundryStatus: 'available', laundryUntil: null },
    { id: 'bot-1', category: 'bottom', laundryStatus: 'available', laundryUntil: null },
    { id: 'sho-1', category: 'shoes', laundryStatus: 'available', laundryUntil: null },
  ];

  const wornOutfit = {
    id: 'outfit-1',
    topId: 'top-1',
    bottomId: 'bot-1',
    shoesId: 'sho-1',
  };

  const wearDate = '2026-09-27';
  const updated = applyWearToClothingLaundry(wornOutfit, mockClothing, wearDate);

  const top = updated.find((c) => c.id === 'top-1');
  const bottom = updated.find((c) => c.id === 'bot-1');
  const shoes = updated.find((c) => c.id === 'sho-1');

  // Top and Bottom must be in_laundry with 7 days expiration
  assert.strictEqual(top.laundryStatus, 'in_laundry');
  assert.strictEqual(top.laundryUntil, '2026-10-04');

  assert.strictEqual(bottom.laundryStatus, 'in_laundry');
  assert.strictEqual(bottom.laundryUntil, '2026-10-04');

  // Shoes must NOT be placed into laundry automatically
  assert.strictEqual(shoes.laundryStatus, 'available');
  assert.strictEqual(shoes.laundryUntil, null);
});

it('automatically expires laundry when reference date >= laundryUntil', () => {
  const mockClothing = [
    { id: 'item-expired', laundryStatus: 'in_laundry', laundryUntil: '2026-09-20' },
    { id: 'item-still-cleaning', laundryStatus: 'in_laundry', laundryUntil: '2026-10-05' },
    { id: 'item-available', laundryStatus: 'available', laundryUntil: null },
  ];

  // Test with reference date = 2026-09-27
  const referenceDate = new Date('2026-09-27T00:00:00.000Z');
  const { updatedItems, hasChanges } = processLaundryExpiration(mockClothing, referenceDate);

  assert.strictEqual(hasChanges, true);

  const expired = updatedItems.find((c) => c.id === 'item-expired');
  const cleaning = updatedItems.find((c) => c.id === 'item-still-cleaning');

  // Expired item reverted to available and laundryUntil cleared
  assert.strictEqual(expired.laundryStatus, 'available');
  assert.strictEqual(expired.laundryUntil, null);

  // Still cleaning item remains in laundry
  assert.strictEqual(cleaning.laundryStatus, 'in_laundry');
  assert.strictEqual(cleaning.laundryUntil, '2026-10-05');
});

it('supports manual user laundry overrides in both directions', () => {
  const availableItem = { id: 'top-manual', laundryStatus: 'available', laundryUntil: null };
  const inLaundryItem = { id: 'top-manual', laundryStatus: 'in_laundry', laundryUntil: '2026-10-04' };

  // Manual mark in_laundry
  const toLaundry = toggleItemLaundryStatus(availableItem);
  assert.strictEqual(toLaundry.laundryStatus, 'in_laundry');
  assert.ok(toLaundry.laundryUntil);

  // Manual mark available
  const toAvailable = toggleItemLaundryStatus(inLaundryItem);
  assert.strictEqual(toAvailable.laundryStatus, 'available');
  assert.strictEqual(toAvailable.laundryUntil, null);
});

it('formats remaining laundry time readable strings', () => {
  const str = formatLaundryTimeRemaining(null);
  assert.strictEqual(str, 'In Laundry');
});

// ============================================================================
// 3. ANALYTICS SERVICE TESTS (Requirements #36-#40)
// ============================================================================
console.log('\n[3. Analytics Service & Usage Calculations]');

const testClothing = [
  { id: 'c1', name: 'White Tee', category: 'top', color: 'White', price: 800, laundryStatus: 'available' },
  { id: 'c2', name: 'Black Tee', category: 'top', color: 'Black', price: 1000, laundryStatus: 'available' },
  { id: 'c3', name: 'Blue Jeans', category: 'bottom', color: 'Blue', price: 2000, laundryStatus: 'available' },
  { id: 'c4', name: 'Black Pants', category: 'bottom', color: 'Black', price: 1500, laundryStatus: 'in_laundry' },
  { id: 'c5', name: 'White Sneakers', category: 'shoes', color: 'White', price: 3000, laundryStatus: 'available' },
];

const testOutfits = [
  { id: 'o1', name: 'Casual White', topId: 'c1', bottomId: 'c3', shoesId: 'c5' },
  { id: 'o2', name: 'All Black', topId: 'c2', bottomId: 'c4', shoesId: 'c5' },
];

// Wear history:
// o1 worn 3 times (dates 2026-09-10, 2026-09-12, 2026-09-14)
// o2 worn 1 time (date 2026-09-15)
//
// Usage counts per clothing:
// c1 (White Tee): 3 wears
// c3 (Blue Jeans): 3 wears
// c5 (White Sneakers): 3 + 1 = 4 wears
// c2 (Black Tee): 1 wear
// c4 (Black Pants): 1 wear
const testWearRecords = [
  { id: 'w1', outfitId: 'o1', wornDate: '2026-09-10' },
  { id: 'w2', outfitId: 'o1', wornDate: '2026-09-12' },
  { id: 'w3', outfitId: 'o1', wornDate: '2026-09-14' },
  { id: 'w4', outfitId: 'o2', wornDate: '2026-09-15' },
];

it('calculates Top 3 Most Used Clothing strictly from confirmed wear records', () => {
  const top3 = getTopUsedClothing(testClothing, testOutfits, testWearRecords, 3);

  assert.strictEqual(top3.length, 3);
  // c5 had 4 wears
  assert.strictEqual(top3[0].item.id, 'c5');
  assert.strictEqual(top3[0].wearCount, 4);

  // Second and third items have 3 wears
  assert.strictEqual(top3[1].wearCount, 3);
  assert.strictEqual(top3[2].wearCount, 3);
});

it('calculates Top Outfit with maximum wear count', () => {
  const result = getTopOutfit(testOutfits, testWearRecords);
  assert.ok(result);
  assert.strictEqual(result.outfit.id, 'o1');
  assert.strictEqual(result.wearCount, 3);
});

it('returns null for Top Outfit when no wear records exist', () => {
  const result = getTopOutfit(testOutfits, []);
  assert.strictEqual(result, null);
});

it('calculates Top Color across all worn outfit components', () => {
  // o1 has White (c1), Blue (c3), White (c5) => each wear has 2 White, 1 Blue. 3 wears = 6 White, 3 Blue.
  // o2 has Black (c2), Black (c4), White (c5) => 1 wear = 2 Black, 1 White.
  // Total: White = 7, Blue = 3, Black = 2.
  const topColor = getTopColor(testClothing, testOutfits, testWearRecords);
  assert.ok(topColor);
  assert.strictEqual(topColor.color, 'White');
  assert.strictEqual(topColor.count, 7);
});

it('calculates Total Wardrobe Value summing each clothing price exactly once without double counting', () => {
  // Prices: 800 + 1000 + 2000 + 1500 + 3000 = 8300
  const total = getTotalWardrobeValue(testClothing);
  assert.strictEqual(total, 8300);
});

it('provides accurate category breakdown counts', () => {
  const counts = getCategoryBreakdown(testClothing);
  assert.strictEqual(counts.top, 2);
  assert.strictEqual(counts.bottom, 2);
  assert.strictEqual(counts.shoes, 1);
  assert.strictEqual(counts.total, 5);
});

it('provides accurate laundry breakdown counts', () => {
  const breakdown = getLaundryBreakdown(testClothing);
  assert.strictEqual(breakdown.available, 4);
  assert.strictEqual(breakdown.inLaundry, 1);
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log(`\nResults: ${passedTests} / ${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log('✓ All verification tests passed successfully!\n');
} else {
  console.error('✗ Some tests failed.\n');
  process.exit(1);
}
