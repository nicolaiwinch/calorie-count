/**
 * State management — bridges the API with the UI.
 * Keeps a local copy of entries for fast rendering,
 * syncs with the backend on every change.
 */

import { DAY_START_HOUR } from './config.js';
import * as api from './api.js';

let entries = [];
let currentUser = localStorage.getItem('current_user') || null;
let userProfile = null;

// --- Day helpers ---

export function getDayStart() {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(DAY_START_HOUR, 0, 0, 0);
  if (now < dayStart) {
    dayStart.setDate(dayStart.getDate() - 1);
  }
  return dayStart;
}

export function getDayKey() {
  return getDayStart().toISOString().slice(0, 10);
}

// --- User ---

export function getCurrentUser() {
  return currentUser;
}

export function getUserProfile() {
  return userProfile;
}

export function getDailyBurn() {
  return userProfile?.daily_burn || 2200;
}

export async function setCurrentUser(userId) {
  currentUser = userId;
  localStorage.setItem('current_user', userId);
  userProfile = await api.getUser(userId);
  await loadEntries();
}

export async function listUsers() {
  return api.listUsers();
}

export async function createUser(userId, profile) {
  await api.saveUser(userId, profile);
  return setCurrentUser(userId);
}

export async function updateUser(userId, profile) {
  userProfile = await api.saveUser(userId, profile);
}

// --- Entries ---

export function getEntries() {
  return entries;
}

export async function loadEntries() {
  if (!currentUser) {
    entries = [];
    return;
  }
  try {
    entries = await api.getEntries(currentUser, getDayKey());
  } catch {
    entries = [];
  }
}

export async function addEntryToState(type, name, cal) {
  const entry = {
    type,
    name,
    cal,
    time: new Date().toISOString(),
  };
  const saved = await api.addEntry(currentUser, entry);
  entries.push(saved);
}

export async function deleteEntryFromState(entryId) {
  await api.deleteEntry(currentUser, getDayKey(), entryId);
  entries = entries.filter(e => e.id !== entryId);
}

export async function clearEntries() {
  // Delete all entries one by one
  const day = getDayKey();
  await Promise.all(entries.map(e => api.deleteEntry(currentUser, day, e.id)));
  entries = [];
}

export function getTotals() {
  let eaten = 0;
  let exercise = 0;
  entries.forEach(e => {
    if (e.type === 'food') eaten += e.cal;
    else exercise += e.cal;
  });
  return { eaten, exercise };
}
