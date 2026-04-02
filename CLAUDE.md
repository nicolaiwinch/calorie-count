# Calorie Counter PWA

## Overview
A Progressive Web App for tracking daily calorie intake vs burn rate.
Frontend hosted on GitHub Pages at: https://nicolaiwinch.github.io/calorie-count/
Backend API runs in a Docker container (FastAPI + JSON file storage).

## Architecture
- Frontend: vanilla JS with ES modules — no build step, no frameworks, no npm
- Backend: FastAPI (Python) with JSON file-based storage
- Frontend served as static files via GitHub Pages
- JS is bundled inline in index.html to avoid service worker caching issues

## Project Structure
```
index.html          - HTML shell with inline-bundled JS
manifest.json       - PWA manifest
sw.js               - Service worker for offline support
Dockerfile          - Container for the API server
css/
  colors.css        - CSS custom properties (theme)
  main.css          - Layout and base styles
  components.css    - Buttons, cards, modal, log entries
js/
  app.js            - Entry point, wires modules together
  api.js            - API client (fetch wrapper for backend)
  config.js         - Constants (daily burn, thresholds, quick picks, API URL)
  state.js          - Data model, localStorage persistence
  burn.js           - Live burn rate calculator
  ui.js             - DOM rendering (display, log)
  modal.js          - Add food/exercise modal
icons/
  icon-192.png      - PWA icon
  icon-512.png      - PWA icon
api/
  main.py           - FastAPI entry point
  config.py         - API configuration
  models.py         - Pydantic data models
  routes/
    entries.py      - CRUD routes for food/exercise entries
    users.py        - User profile routes
  storage/
    base.py         - Storage backend interface
    json_backend.py - JSON file storage implementation
  data/             - Runtime data (gitignored)
```

## Deployment
- Frontend: push to main → GitHub Pages auto-deploys
- Backend: build Docker image from Dockerfile, deploy to your server
- Repo: github.com/nicolaiwinch/calorie-count (personal account)

## Key Design Decisions
- ES modules (type="module") for clean imports, no bundler needed
- No onclick attributes — all event listeners in JS
- Service worker caches all assets for offline use (bump CACHE_NAME version on changes)
- JS bundled inline in index.html to work around service worker caching issues
