// ── 農業部畜產試驗所危害告知單 Service Worker ──
// 版本號：每次更新內容時請遞增，確保舊快取被清除
const CACHE_VERSION = 'hazard-v1.0';

// 需要快取的檔案（離線可用）
const CACHE_FILES = [
  './hazard-form.html',
  './style.css',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// ── 安裝：快取所有資源 ──
self.addEventListener('install', event => {
  console.log('[SW] 安裝中，快取版本：', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(CACHE_FILES).then(() => {
        console.log('[SW] 所有檔案快取完成');
        return self.skipWaiting();
      });
    }).catch(err => {
      console.warn('[SW] 快取部分檔案失敗（不影響運作）：', err);
      return self.skipWaiting();
    })
  );
});

// ── 啟動：清除舊版快取 ──
self.addEventListener('activate', event => {
  console.log('[SW] 啟動，清除舊版快取');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_VERSION)
          .map(name => {
            console.log('[SW] 刪除舊快取：', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── 攔截請求：優先使用快取，失敗時使用網路 ──
self.addEventListener('fetch', event => {
  // 只處理 GET 請求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 有快取：直接回傳快取版本
      if (cachedResponse) {
        // 背景更新快取（stale-while-revalidate）
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_VERSION).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      // 無快取：從網路取得
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        // 順便存入快取
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_VERSION).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // 網路也失敗：回傳離線頁面
        if (event.request.destination === 'document') {
          return caches.match('./hazard-form.html');
        }
      });
    })
  );
});
