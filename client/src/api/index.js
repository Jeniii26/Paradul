/**
 * paradu'l — Unified API Gateway (index.js)
 *
 * Single entry point for all frontend components.
 * Seamlessly toggles between the simulated browser-only storage (mockApi)
 * and the real HTTP backend (httpApi) via VITE_USE_MOCK_API.
 *
 * NOTE:
 * Supabase integration is NOT implemented in this local prototype phase.
 * When Supabase is introduced in a future phase, a Supabase implementation
 * can be plugged into this gateway without altering consuming UI components.
 */

import * as mockApi from './mockApi.js';
import * as httpApi from './httpApi.js';

export const USING_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

const implementation = USING_MOCK_API ? mockApi : httpApi;

export const {
  // Clothing
  listClothing,
  getClothing,
  createClothing,
  updateClothing,
  deleteClothing,

  // Outfits
  listOutfits,
  getOutfit,
  createOutfit,
  updateOutfit,
  deleteOutfit,

  // Schedules
  listSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  markScheduleWorn,

  // Wear history
  listWearRecords,
  logWearRecord,

  // Demo utilities
  resetDemoData,
} = implementation;
