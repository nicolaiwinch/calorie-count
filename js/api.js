/**
 * API client — all communication with the backend goes through here.
 */

import { API_URL } from './config.js';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'API error');
  }
  return res.json();
}

// --- Users ---

export function listUsers() {
  return request('/api/users/');
}

export function getUser(userId) {
  return request(`/api/users/${userId}`);
}

export function saveUser(userId, profile) {
  return request(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
}

// --- Entries ---

export function getEntries(userId, date) {
  return request(`/api/entries/${userId}/${date}`);
}

export function addEntry(userId, entry) {
  return request(`/api/entries/${userId}`, {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}

export function deleteEntry(userId, date, entryId) {
  return request(`/api/entries/${userId}/${date}/${entryId}`, {
    method: 'DELETE',
  });
}

export function listDates(userId) {
  return request(`/api/entries/${userId}/dates`);
}

export function getEntriesRange(userId, start, end) {
  return request(`/api/entries/${userId}/range/${start}/${end}`);
}

export function getConfirmedDays(userId) {
  return request(`/api/entries/${userId}/confirmed`);
}

export function confirmDay(userId, day) {
  return request(`/api/entries/${userId}/confirm/${day}`, { method: 'POST' });
}

export function unconfirmDay(userId, day) {
  return request(`/api/entries/${userId}/confirm/${day}`, { method: 'DELETE' });
}
