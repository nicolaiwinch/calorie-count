export const DAY_START_HOUR = 0; // Midnight
export const GREEN_THRESHOLD = 600;

// API base URL — change this when deploying
export const API_URL = localStorage.getItem('api_url') || 'https://calorie-counter-api-production.up.railway.app';

export const FOOD_QUICK_PICKS = [
  { name: 'Coffee w/ milk', cal: 50 },
  { name: 'Banana', cal: 105 },
  { name: 'Sandwich', cal: 400 },
  { name: 'Salad', cal: 250 },
  { name: 'Rice & chicken', cal: 550 },
  { name: 'Pasta', cal: 600 },
  { name: 'Snack bar', cal: 200 },
  { name: 'Beer', cal: 150 },
];

export const EXERCISE_QUICK_PICKS = [
  { name: 'Walk 30 min', cal: 150 },
  { name: 'Run 30 min', cal: 350 },
  { name: 'Cycling 30 min', cal: 300 },
  { name: 'Gym session', cal: 400 },
  { name: 'Swimming 30 min', cal: 350 },
  { name: 'Yoga 30 min', cal: 120 },
];
