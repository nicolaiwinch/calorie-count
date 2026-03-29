import { GREEN_THRESHOLD } from './config.js';
import { getEntries, getTotals, getCurrentUser, getDailyBurn } from './state.js';
import { getBurnedSoFar } from './burn.js';

function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

export function updateDisplay() {
  const { burned, fraction } = getBurnedSoFar();
  const { eaten, exercise } = getTotals();
  const available = burned - eaten + exercise;

  const el = document.getElementById('availableCalories');
  el.textContent = Math.round(available);

  el.className = 'available-calories';
  if (available < 0) {
    el.classList.add('color-red');
  } else if (available < GREEN_THRESHOLD) {
    el.classList.add('color-yellow');
  } else {
    el.classList.add('color-green');
  }

  // Forecast: what available will be at midnight if no more eating
  const forecast = getDailyBurn() - eaten + exercise;
  const forecastEl = document.getElementById('forecastCalories');
  if (forecastEl) {
    forecastEl.textContent = `${forecast} by midnight`;
  }

  document.getElementById('burnedStat').textContent = Math.round(burned);
  document.getElementById('eatenStat').textContent = eaten;
  document.getElementById('exerciseStat').textContent = exercise;

  const pct = Math.round(fraction * 100);
  document.getElementById('burnBarFill').style.width = pct + '%';
  document.getElementById('burnBarPct').textContent = pct + '%';

  // Show current user
  const userLabel = document.getElementById('currentUserLabel');
  if (userLabel) {
    userLabel.textContent = getCurrentUser() || 'No user';
  }
}

export function renderLog(onDelete) {
  const container = document.getElementById('logEntries');
  const entries = getEntries();

  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-log">No entries yet today</div>';
    return;
  }

  const sorted = [...entries].reverse();
  container.innerHTML = sorted.map(e => {
    const sign = e.type === 'food' ? '-' : '+';
    const cls = e.type === 'food' ? 'food' : 'exercise';
    const time = new Date(e.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="log-entry">
        <div class="log-entry-info">
          <div class="log-entry-name">${escapeHtml(e.name)}</div>
          <div class="log-entry-time">${time}</div>
        </div>
        <div style="display:flex;align-items:center">
          <div class="log-entry-cal ${cls}">${sign}${e.cal}</div>
          <button class="log-entry-delete" data-id="${e.id}">×</button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.log-entry-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      onDelete(btn.dataset.id);
    });
  });
}
