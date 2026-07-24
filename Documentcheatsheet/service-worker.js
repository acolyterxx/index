// 行政資料大補帖 Service Worker
const CACHE_VERSION = 'hazard-v2.9';

const CACHE_FILES = [
  './style.css',
  './form-template-rules.js',
  './form-definitions.js',
  './form-catalog.js',
  './draft-store.js',
  './form-session.js',
  './print-utils.js',
  './print-layout-rules.js',
  './print-verifier.js',
  './signature-utils.js',
  './app-cache.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  console.log('[SW] Installing cache:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(CACHE_FILES).then(() => {
        console.log('[SW] Cache ready');
        return self.skipWaiting();
      });
    }).catch(err => {
      console.warn('[SW] Cache setup failed:', err);
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_VERSION)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  const isDocument = event.request.mode === 'navigate' || event.request.destination === 'document';
  const isFreshAppAsset = requestUrl.pathname.endsWith('.js') || requestUrl.pathname.endsWith('.css') || requestUrl.pathname.endsWith('.json');

  if (isDocument || requestUrl.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(
        '<!doctype html><meta charset="utf-8"><title>離線</title><p>目前無法載入頁面，請確認本機伺服器已啟動後重新整理。</p>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      ))
    );
    return;
  }

  if (isFreshAppAsset) {
    event.respondWith(
      fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_VERSION).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_VERSION).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_VERSION).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => caches.match(event.request));
    })
  );
});
