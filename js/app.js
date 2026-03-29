import {
  loadEntries, addEntryToState, deleteEntryFromState,
  clearEntries, getDayKey, getCurrentUser, setCurrentUser,
  listUsers, createUser
} from './state.js';
import { updateDisplay, renderLog } from './ui.js';
import { initModal, open as openModal } from './modal.js';

function refresh() {
  updateDisplay();
  renderLog(handleDelete);
}

async function handleDelete(entryId) {
  await deleteEntryFromState(entryId);
  refresh();
}

async function handleAdd(type, name, cal) {
  await addEntryToState(type, name, cal);
  refresh();
}

async function resetDay() {
  if (confirm('Reset all entries for today?')) {
    await clearEntries();
    refresh();
  }
}

// --- User selection ---

async function showUserPicker() {
  const picker = document.getElementById('userPicker');
  const app = document.getElementById('appMain');
  picker.classList.add('active');
  app.style.display = 'none';

  const users = await listUsers();
  const list = document.getElementById('userList');

  if (users.length === 0) {
    list.innerHTML = '<div class="empty-log">No users yet — create one below</div>';
  } else {
    list.innerHTML = users.map(u => `
      <button class="user-pick-btn" data-id="${u.id}">${u.name}</button>
    `).join('');

    list.querySelectorAll('.user-pick-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        await selectUser(btn.dataset.id);
      });
    });
  }
}

async function selectUser(userId) {
  await setCurrentUser(userId);
  document.getElementById('userPicker').classList.remove('active');
  document.getElementById('appMain').style.display = 'block';
  refresh();
}

async function handleCreateUser() {
  const name = document.getElementById('newUserName').value.trim();
  const pin = document.getElementById('newUserPin').value.trim();
  if (!name) return;

  const userId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  await createUser(userId, { name, daily_burn: 2200, pin });

  document.getElementById('userPicker').classList.remove('active');
  document.getElementById('appMain').style.display = 'block';
  refresh();
}

// --- Init ---

async function init() {
  initModal(handleAdd);

  document.getElementById('btnFood').addEventListener('click', () => openModal('food'));
  document.getElementById('btnExercise').addEventListener('click', () => openModal('exercise'));
  document.getElementById('btnReset').addEventListener('click', resetDay);
  document.getElementById('btnSwitchUser').addEventListener('click', showUserPicker);
  document.getElementById('btnCreateUser').addEventListener('click', handleCreateUser);

  // If we have a remembered user, try to load them
  const savedUser = getCurrentUser();
  if (savedUser) {
    try {
      await setCurrentUser(savedUser);
      refresh();
    } catch {
      showUserPicker();
    }
  } else {
    showUserPicker();
  }

  // Live counter
  setInterval(updateDisplay, 1000);

  // Day rollover
  let currentDayKey = getDayKey();
  setInterval(async () => {
    const newKey = getDayKey();
    if (newKey !== currentDayKey) {
      currentDayKey = newKey;
      await loadEntries();
      refresh();
    }
  }, 60000);

  // Service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
}

init();
