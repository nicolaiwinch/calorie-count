import { loadEntries, addEntryToState, deleteEntryFromState, clearEntries, getDayKey } from './state.js';
import { updateDisplay, renderLog } from './ui.js';
import { initModal, open as openModal } from './modal.js';

function refresh() {
  updateDisplay();
  renderLog(handleDelete);
}

function handleDelete(index) {
  deleteEntryFromState(index);
  refresh();
}

function handleAdd(type, name, cal) {
  addEntryToState(type, name, cal);
  refresh();
}

function resetDay() {
  if (confirm('Reset all entries for today?')) {
    clearEntries();
    refresh();
  }
}

// Init
loadEntries();
initModal(handleAdd);
refresh();

// Wire up buttons
document.getElementById('btnFood').addEventListener('click', () => openModal('food'));
document.getElementById('btnExercise').addEventListener('click', () => openModal('exercise'));
document.getElementById('btnReset').addEventListener('click', resetDay);

// Live counter update every second
setInterval(updateDisplay, 1000);

// Day rollover check every minute
let currentDayKey = getDayKey();
setInterval(() => {
  const newKey = getDayKey();
  if (newKey !== currentDayKey) {
    currentDayKey = newKey;
    loadEntries();
    refresh();
  }
}, 60000);

// Service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
