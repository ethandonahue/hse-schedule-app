if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js')
        .then((reg) => {
          //console.log('Service worker registered.', reg);
        }).catch(function(err){
            //console.error("Service worker registration failed with error "+err);
        });
  });
} else {
  //console.error("Service worker registration failed.");
}

const CACHE_NAME = 'HSEScheduleAppCache';

const FILES_TO_CACHE = [
  '/index.html',
  '/screens/offline/offline.html',
  '/styling/index.css',
  '/styling/home.css',
  '/manifest.json',
  '/serviceworker.js',
  '/js/storageChecker.js',
  '/images/HSEScheduleAppLogo192.png',
  '/images/HSEScheduleAppLogo512.png',
  '/images/notifications-unselected-white.png',
  '/images/notifications-selected-white.png',
  'images/schedule-unselected-white.png',
  'images/schedule-selected-white.png',
  '/images/home-unselected-white.png',
  '/images/home-selected-white.png',
  '/images/calendar-unselected-white.png',
  '/images/calendar-selected-white.png',
  '/images/settings-unselected-white.png',
  '/images/settings-selected.png'
];

self.addEventListener('install', (evt) => {
  //console.log('[ServiceWorker] Install');
  evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        //console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  //console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          //console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  //console.log('[ServiceWorker] Fetch', evt.request.url);
  if (evt.request.mode !== 'navigate') {
    return;
  }
  evt.respondWith(
      fetch(evt.request)
          .catch(() => {
            return caches.open(CACHE_NAME)
                .then((cache) => {
                  return cache.match('/screens/offline/offline.html');
                });
          })
  );
});
