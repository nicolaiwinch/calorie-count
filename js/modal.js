import { FOOD_QUICK_PICKS, EXERCISE_QUICK_PICKS } from './config.js';

let currentMode = 'food';
let onAddCallback = null;

const overlay = () => document.getElementById('modalOverlay');
const nameInput = () => document.getElementById('entryName');
const calInput = () => document.getElementById('entryCal');

export function initModal(onAdd) {
  onAddCallback = onAdd;

  overlay().addEventListener('click', (e) => {
    if (e.target === overlay()) close();
  });

  document.getElementById('modalCancel').addEventListener('click', close);
  document.getElementById('modalAddBtn').addEventListener('click', submit);
}

export function open(mode) {
  currentMode = mode;
  overlay().classList.add('active');

  document.getElementById('modalTitle').textContent =
    mode === 'food' ? 'Add Food' : 'Add Exercise';
  nameInput().placeholder =
    mode === 'food' ? 'What did you eat?' : 'What exercise?';

  const addBtn = document.getElementById('modalAddBtn');
  addBtn.className = 'modal-btn modal-btn-add' + (mode === 'food' ? ' food-mode' : '');

  const picks = mode === 'food' ? FOOD_QUICK_PICKS : EXERCISE_QUICK_PICKS;
  document.getElementById('quickPicks').innerHTML = picks.map(p =>
    `<button class="quick-pick" data-name="${p.name}" data-cal="${p.cal}">${p.name} (${p.cal})</button>`
  ).join('');

  document.getElementById('quickPicks').querySelectorAll('.quick-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      nameInput().value = btn.dataset.name;
      calInput().value = btn.dataset.cal;
    });
  });

  nameInput().value = '';
  calInput().value = '';
  setTimeout(() => nameInput().focus(), 100);
}

function close() {
  overlay().classList.remove('active');
}

function submit() {
  const name = nameInput().value.trim() || (currentMode === 'food' ? 'Food' : 'Exercise');
  const cal = parseInt(calInput().value);
  if (!cal || cal <= 0) return;

  if (onAddCallback) {
    onAddCallback(currentMode, name, cal);
  }
  close();
}
