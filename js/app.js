import {
  loadEntries, addEntryToState, deleteEntryFromState,
  clearEntries, getDayKey, getCurrentUser, getUserProfile,
  setCurrentUser, listUsers, createUser, updateUser
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

  const list = document.getElementById('userList');

  try {
    const users = await listUsers();

    if (users.length === 0) {
      list.innerHTML = '<div class="empty-log">No users yet — create one below</div>';
    } else {
      list.innerHTML = users.map(u => {
        const detail = u.daily_burn ? `${u.daily_burn} kcal/day` : '';
        return `<button class="user-pick-btn" data-id="${u.id}">${u.name} <span style="opacity:0.4;font-size:13px;float:right">${detail}</span></button>`;
      }).join('');

      list.querySelectorAll('.user-pick-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          await selectUser(btn.dataset.id);
        });
      });
    }
  } catch (err) {
    list.innerHTML = `<div class="empty-log" style="opacity:0.6">Cannot reach server.<br>Check your connection.<br><br><small style="opacity:0.5">${err.message}</small></div>`;
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
  if (!name) return;

  const gender = document.getElementById('newUserGender').value;
  const age = parseInt(document.getElementById('newUserAge').value) || 0;
  const weight = parseFloat(document.getElementById('newUserWeight').value) || 0;
  const height = parseFloat(document.getElementById('newUserHeight').value) || 0;
  const pin = document.getElementById('newUserPin').value.trim();

  const activity = document.getElementById('newUserActivity').value;
  const userId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  await createUser(userId, { name, gender, age, weight_kg: weight, height_cm: height, activity, pin });

  document.getElementById('userPicker').classList.remove('active');
  document.getElementById('appMain').style.display = 'block';
  refresh();
}

// --- Profile ---

function openProfile() {
  const profile = getUserProfile();
  if (!profile) return;

  document.getElementById('profileName').value = profile.name || '';
  document.getElementById('profileAge').value = profile.age || '';
  document.getElementById('profileWeight').value = profile.weight_kg || '';
  document.getElementById('profileHeight').value = profile.height_cm || '';
  document.getElementById('profileActivity').value = profile.activity || 'light';

  // Set gender select — need to explicitly set selectedIndex for reliability
  const genderSelect = document.getElementById('profileGender');
  const genderValue = profile.gender || '';
  for (let i = 0; i < genderSelect.options.length; i++) {
    if (genderSelect.options[i].value === genderValue) {
      genderSelect.selectedIndex = i;
      break;
    }
  }

  updateBurnDisplay();
  document.getElementById('profileOverlay').classList.add('active');
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.3,
  moderate: 1.4,
  active: 1.5,
  very_active: 1.6,
};

function updateBurnDisplay() {
  const gender = document.getElementById('profileGender').value;
  const age = parseInt(document.getElementById('profileAge').value) || 0;
  const weight = parseFloat(document.getElementById('profileWeight').value) || 0;
  const height = parseFloat(document.getElementById('profileHeight').value) || 0;
  const activity = document.getElementById('profileActivity').value;

  const display = document.getElementById('profileBurnDisplay');

  if (!gender || !age || !weight || !height) {
    display.textContent = 'Fill in all fields to calculate daily burn';
    display.style.color = 'var(--text-muted)';
    return;
  }

  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === 'male' ? 5 : -161;
  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  const activityLabels = {
    sedentary: 'sedentary',
    light: 'lightly active',
    moderate: 'moderately active',
    active: 'active',
    very_active: 'very active',
  };
  const label = activityLabels[activity] || activity;
  display.innerHTML = `<div style="font-size:36px;font-weight:200;margin-bottom:4px">${tdee} <span style="font-size:16px">kcal/day</span></div><div style="font-size:12px;opacity:0.6">BMR ${Math.round(bmr)} × ${multiplier} (${label})</div>`;
  display.style.color = 'var(--color-green)';
}

async function saveProfile() {
  const userId = getCurrentUser();
  const profile = {
    name: document.getElementById('profileName').value.trim(),
    gender: document.getElementById('profileGender').value,
    age: parseInt(document.getElementById('profileAge').value) || 0,
    weight_kg: parseFloat(document.getElementById('profileWeight').value) || 0,
    height_cm: parseFloat(document.getElementById('profileHeight').value) || 0,
    activity: document.getElementById('profileActivity').value,
    pin: getUserProfile()?.pin || '',
  };

  await updateUser(userId, profile);
  document.getElementById('profileOverlay').classList.remove('active');
  refresh();
}

// --- Init ---

async function init() {
  initModal(handleAdd);

  // Main buttons
  document.getElementById('btnFood').addEventListener('click', () => openModal('food'));
  document.getElementById('btnExercise').addEventListener('click', () => openModal('exercise'));
  document.getElementById('btnReset').addEventListener('click', resetDay);
  document.getElementById('btnSwitchUser').addEventListener('click', showUserPicker);
  document.getElementById('btnCreateUser').addEventListener('click', handleCreateUser);

  // Profile
  document.getElementById('btnProfile').addEventListener('click', openProfile);
  document.getElementById('profileCancel').addEventListener('click', () => {
    document.getElementById('profileOverlay').classList.remove('active');
  });
  document.getElementById('profileOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('profileOverlay')) {
      document.getElementById('profileOverlay').classList.remove('active');
    }
  });
  document.getElementById('profileSave').addEventListener('click', saveProfile);

  // Live calculation preview in profile modal
  ['profileGender', 'profileAge', 'profileWeight', 'profileHeight', 'profileActivity'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateBurnDisplay);
    document.getElementById(id).addEventListener('change', updateBurnDisplay);
  });

  // If we have a remembered user, try to load them
  const savedUser = getCurrentUser();
  if (savedUser) {
    try {
      await setCurrentUser(savedUser);
      refresh();
    } catch {
      await showUserPicker();
    }
  } else {
    await showUserPicker();
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
