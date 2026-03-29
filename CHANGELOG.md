# Calorie Counter — Project Log

## Architecture

```
iPhone/Browser                GitHub Pages              Railway
  (you open app)  ──GET──▶  (serves HTML/CSS/JS)
  (add food)      ──POST──▶                            (Python API + JSON storage)
  (get entries)   ──GET──▶                             (Python API + JSON storage)
```

- **Frontend:** https://nicolaiwinch.github.io/calorie-count/
- **Backend API:** https://calorie-counter-api-production.up.railway.app/
- **Source code:** https://github.com/nicolaiwinch/calorie-count
- **API docs:** https://calorie-counter-api-production.up.railway.app/docs

## Tech Stack

- Frontend: Vanilla HTML, CSS, JavaScript (ES modules, no build step)
- Backend: Python 3.13, FastAPI
- Storage: JSON flat files (behind abstraction layer, swappable to DB)
- Hosting: GitHub Pages (frontend) + Railway (backend)
- PWA: installable on iPhone via Safari "Add to Home Screen"

## Users

- **nicolai** — daily burn 2200 kcal
- **partner** — daily burn 1800 kcal (placeholder name)

---

## 2026-03-29 — Initial build

### v0.1 — PWA with localStorage
- Created calorie counter PWA (single index.html)
- Live burn counter (2200 kcal/day, midnight to midnight)
- Color coding: red (< 0), yellow (0–600), green (600+)
- Add food (subtracts) and exercise (adds)
- Quick-pick presets for common foods and exercises
- Day progress bar
- Reset button
- Offline support via service worker
- Deployed frontend to GitHub Pages

### v0.2 — Modular restructure
- Split monolithic index.html into separate files:
  - `css/` — colors.css (theme variables), main.css (layout), components.css (UI elements)
  - `js/` — app.js, config.js, state.js, burn.js, ui.js, modal.js
- ES modules with clean imports, no build tools needed
- No inline JS or CSS, all event listeners in JS

### v0.3 — Python backend + multi-user
- Built FastAPI backend (`api/` directory)
- Storage abstraction: `StorageBackend` base class + `JsonStorage` implementation
- Data stored as `data/entries/{user_id}/{date}.json` and `data/users.json`
- API endpoints: users (list, get, create) + entries (get, add, delete)
- Frontend now calls API instead of localStorage
- Added `api.js` — API client module
- User picker screen ("Who's counting?")
- Switch user button
- Per-user daily burn rate (stored in profile)
- CORS enabled for cross-origin frontend→API calls
- Deployed backend to Railway (always-on, no cold starts)
- Created two user profiles (nicolai, partner)

---

## Planned / Ideas

- [ ] Rename "partner" to girlfriend's actual name
- [ ] Deploy backend to personal VPS (replace Railway long-term)
- [ ] History view (past days)
- [ ] Weekly/monthly trends
- [ ] Custom quick picks per user
- [ ] Stock tracker app (second app on same infra)
- [ ] Claude Code skill for logging calories from terminal
- [ ] Agent for estimating calories from food descriptions
- [ ] Proper authentication (replace PIN)
