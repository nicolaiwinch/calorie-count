# Calorie Counter PWA

## Overview
A Progressive Web App for tracking daily calorie intake vs burn rate.
Hosted on GitHub Pages at: https://nicolaiwinch.github.io/calorie-count/

## Architecture
- Pure vanilla JS with ES modules — no build step, no frameworks, no npm
- Served as static files via GitHub Pages
- Data stored in browser localStorage

## Project Structure
```
index.html          - HTML shell only, loads CSS and JS
manifest.json       - PWA manifest
sw.js               - Service worker for offline support
css/
  colors.css        - CSS custom properties (theme)
  main.css          - Layout and base styles
  components.css    - Buttons, cards, modal, log entries
js/
  app.js            - Entry point, wires modules together
  config.js         - Constants (daily burn, thresholds, quick picks)
  state.js          - Data model, localStorage persistence
  burn.js           - Live burn rate calculator
  ui.js             - DOM rendering (display, log)
  modal.js          - Add food/exercise modal
icons/
  icon-192.png      - PWA icon
  icon-512.png      - PWA icon
```

## Deployment
Push to main → GitHub Pages auto-deploys.
Repo: github.com/nicolaiwinch/calorie-count (personal account)

## Key Design Decisions
- No inline JS or CSS — everything in separate files
- ES modules (type="module") for clean imports, no bundler needed
- No onclick attributes — all event listeners in JS
- Service worker caches all assets for offline use (bump CACHE_NAME version on changes)
