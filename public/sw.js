const CACHE_NAME = 'paragraph-static-v4';
const urlsToCache = [
  '/styles.css',
  'https://paragraph.b-cdn.net/battle/Home%20page%20images/logo.webp',
  'https://paragraph.b-cdn.net/battle/Home%20page%20images/img1.webp?width=420'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.log('Cache install failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (
    request.destination === 'image' &&
    url.pathname.includes('img1.webp')
  ) {
    return;
  }

  if (
    request.method !== 'GET' ||
    url.pathname.startsWith('/app') ||
    url.pathname.includes('auth') ||
    url.search.includes('auth=')
  ) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      })
      .catch(() => {
        return fetch(request);
      })
  );
});
