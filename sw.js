// Service worker that doesn't cache — ensures fresh content always
// We'll add smart caching later when the app is more stable

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Delete all old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always go to network, no caching
  e.respondWith(fetch(e.request));
});
