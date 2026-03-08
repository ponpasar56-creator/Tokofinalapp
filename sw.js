const CACHE_NAME = 'tokofull-v1';
const urlsToCache = [
  '/Tokofinalapp/',
  '/Tokofinalapp/index.html',
  '/Tokofinalapp/manifest.json',
  '/Tokofinalapp/icon-192.png',
  '/Tokofinalapp/offline.html'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Cache file baru
            if (event.request.url.startsWith(self.location.origin)) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Jika offline, tampilkan offline.html
            if (event.request.mode === 'navigate') {
              return caches.match('/Tokofinalapp/offline.html');
            }
          });
      })
  );
});
