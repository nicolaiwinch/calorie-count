import { DAILY_BURN } from './config.js';
import { getDayStart } from './state.js';

export function getBurnedSoFar() {
  const now = new Date();
  const dayStart = getDayStart();
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const elapsed = now - dayStart;
  const total = dayEnd - dayStart;
  const fraction = Math.min(elapsed / total, 1);

  return {
    burned: Math.floor(DAILY_BURN * fraction),
    fraction,
  };
}
