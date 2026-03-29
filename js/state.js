import { DAY_START_HOUR } from './config.js';

let entries = [];

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

export function getEntries() {
  return entries;
}

export function loadEntries() {
  const key = 'cal_' + getDayKey();
  entries = JSON.parse(localStorage.getItem(key) || '[]');
}

export function saveEntries() {
  const key = 'cal_' + getDayKey();
  localStorage.setItem(key, JSON.stringify(entries));
}

export function addEntryToState(type, name, cal) {
  entries.push({
    type,
    name,
    cal,
    time: new Date().toISOString(),
  });
  saveEntries();
}

export function deleteEntryFromState(index) {
  entries.splice(index, 1);
  saveEntries();
}

export function clearEntries() {
  entries = [];
  saveEntries();
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
