const CACHE_NAME = 'HSEScheduleAppCache';

const FILES_TO_CACHE = [
  '/index.html',
  '/main.html',
  '/styling/index.css',
  '/styling/notifications.css',
  '/styling/bellSchedule.css',
  '/styling/home.css',
  '/styling/calendar.css',
  '/styling/settings.css',
  '/styling/style.css',
  '/manifest.json',
  '/serviceworker.js',
  '/js/storageChecker.js',
  '/js/ScriptPlus.js',
  '/js/timeMonitor.js',
  '/js/scheduleTable.js',
  '/js/themeSwitcher.js',
  '/images/HSEScheduleAppLogo192.png',
  '/images/HSEScheduleAppLogo512.png',
  '/images/selected/notifications.png',
  '/images/selected/schedule.png',
  '/images/selected/home.png',
  '/images/selected/calendar.png',
  '/images/selected/settings.png',
  '/images/unselected/notifications.png',
  '/images/unselected/schedule.png',
  '/images/unselected/home.png',
  '/images/unselected/calendar.png',
  '/images/unselected/settings.png'
];

const publicKey = "BHV9vDKgZXPZH3S--ZPlDH4R4LQ636jvztTtYQppjrpVfJY3btRPzFhuvGY_xFrvpvCeAvMnJ7p3Vh2rykeaV54";

if('serviceWorker' in navigator){ //&& 'PushManager' in window){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js')
      .then((reg) => {
        registration = reg;
        //checkNotificationSubscription();
        //console.log('Service worker registered.', reg);
      }).catch(function(err){
        //console.error("Service worker registration failed with error "+err);
      });
  });
} else {
  //console.error("Service worker registration failed.");
}

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
                  return cache.match('/main.html');
                });
          })
  );
});
