// Network-first service worker with auto-update
// Bump SW_VERSION to force cache refresh on all clients
var SW_VERSION = '20260524c';
var CACHE_NAME = 'calorie-v' + SW_VERSION;

self.addEventListener('install', function(e) {
  // Activate immediately, don't wait for old tabs to close
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  // Delete all old caches
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  // Take control of all open tabs immediately
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Only handle same-origin GET requests (not API calls)
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    // Network first — always try to get fresh content
    fetch(e.request).then(function(response) {
      // Cache the fresh response for offline fallback
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(e.request, clone);
      });
      return response;
    }).catch(function() {
      // Network failed — serve from cache (offline support)
      return caches.match(e.request);
    })
  );
});
