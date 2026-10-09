// paradu'l — HTTP API Client


const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : (typeof process !== 'undefined' && process.env ? process.env : {});

const BASE = env.VITE_API_BASE_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // response body was not JSON
    }
    throw new Error(message);
  }

  return response.status === 204 ? null : response.json();
}

// Clothing API
export const listClothing = () => request('/api/clothing');
export const getClothing = (id) => request(`/api/clothing/${id}`);
export const createClothing = (input) =>
  request('/api/clothing', { method: 'POST', body: JSON.stringify(input) });
export const updateClothing = (id, input) =>
  request(`/api/clothing/${id}`, { method: 'PUT', body: JSON.stringify(input) });
export const deleteClothing = (id) =>
  request(`/api/clothing/${id}`, { method: 'DELETE' });

// Outfits API
export const listOutfits = () => request('/api/outfits');
export const getOutfit = (id) => request(`/api/outfits/${id}`);
export const createOutfit = (input) =>
  request('/api/outfits', { method: 'POST', body: JSON.stringify(input) });
export const updateOutfit = (id, input) =>
  request(`/api/outfits/${id}`, { method: 'PUT', body: JSON.stringify(input) });
export const deleteOutfit = (id) =>
  request(`/api/outfits/${id}`, { method: 'DELETE' });

// Schedules API
export const listSchedules = () => request('/api/schedules');
export const createSchedule = (input) =>
  request('/api/schedules', { method: 'POST', body: JSON.stringify(input) });
export const updateSchedule = (id, input) =>
  request(`/api/schedules/${id}`, { method: 'PUT', body: JSON.stringify(input) });
export const deleteSchedule = (id) =>
  request(`/api/schedules/${id}`, { method: 'DELETE' });
export const markScheduleWorn = (id) =>
  request(`/api/schedules/${id}/worn`, { method: 'POST' });

// Wear Records API
export const listWearRecords = () => request('/api/wear-records');
export const logWearRecord = (outfitId, wornDate) =>
  request('/api/wear-records', { method: 'POST', body: JSON.stringify({ outfitId, wornDate }) });

// Reset API
export const resetDemoData = () => request('/api/dev/reset', { method: 'POST' });
