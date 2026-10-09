// paradu'l — Unified API Gateway

import * as mockApi from './mockApi.js';
import * as httpApi from './httpApi.js';
import * as supabaseApi from './supabaseApi.js';
import { isSupabaseConfigured } from './supabaseClient.js';

const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {});

export const USING_MOCK_API = env.VITE_USE_MOCK_API === 'true';
export const USING_SUPABASE = !USING_MOCK_API && isSupabaseConfigured;

const implementation = USING_SUPABASE
  ? supabaseApi
  : !USING_MOCK_API
  ? httpApi
  : mockApi;

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
