const CACHE_NAME = 'HSEScheduleAppCache';

const FILES_TO_CACHE = [
  '/index.html',
  '/screens/offline/offline.html',
  '/styling/index.css',
  '/styling/notifications.css',
  '/styling/bellSchedule.css',
  '/styling/home.css',
  '/styling/calendar.css',
  '/styling/settings.css',
  '/manifest.json',
  '/serviceworker.js',
  '/js/storageChecker.js',
  '/js/ScriptPlus.js',
  '/images/HSEScheduleAppLogo192.png',
  '/images/HSEScheduleAppLogo512.png',
  '/images/notifications-unselected-white.png',
  '/images/notifications-selected-white.png',
  '/images/schedule-unselected-white.png',
  '/images/schedule-selected-white.png',
  '/images/home-unselected-white.png',
  '/images/home-selected-white.png',
  '/images/calendar-unselected-white.png',
  '/images/calendar-selected-white.png',
  '/images/settings-unselected-white.png',
  '/images/settings-selected-white.png'
];

if('serviceWorker' in navigator && 'PushManager' in window){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js')
      .then((reg) => {
        registration = reg;
        checkNotificationSubscription();
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
                  return cache.match('/screens/offline/offline.html');
                });
          })
  );
});

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Test';
  const options = {
    body: 'Yay it works.',
    icon: '/images/HSEScheduleAppLogo192.png',
    badge: '/images/notifications-selected-white.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

function checkNotificationSubscription(){
  registration.pushManager.getSubscription()
  .then((subscription) => {
    isSubscribed = !(subscription == null);
    subscribeToggle = document.getElementById("notificationSubscription");
    if(isSubscribed){
      //console.log('User is subscribed to notifications');
    } else {
      //console.log('User is NOT subscribed to notifications');
    }
    if(subscribeToggle != null){
      subscribeToggle.addEventListener('click', () => {
        subscribeToggle.disabled = true;
        if (isSubscribed) {
          //unsubscribe
        } else {
          subscribeToNotifications();
        }
      });
      updateSubscribeButton();
    }
  });
}

function updateSubscribeButton(){
  if(Notification.permission == 'denied'){
    subscribeToggle.textContent = 'Push Notifications Disabled';
    subscribeToggle.disabled = true;
    return;
  }
  if(isSubscribed){
    subscribeToggle.textContent = "Disable Push Notifications";
    subscribeToggle.disabled = false;
  } else {
    subscribeToggle.textContent = "Enable Push Notifications";
    subscribeToggle.disabled = false;
  }
}

function subscribeToNotifications(){
  registration.pushManager.subscribe({
    userVisibleOnly:true,
    applicationServerKey:"BHizapnyZZR5GsGUHeTUQhwRIr5TzBBAc0PpBAAhiaJGA9Rbac3_ndncISr-be0T4EjnXqHSIa3fSkqBiCVB59I"
  })
  .then((subscription) => {
    console.log('User is subscribed.');
    isSubscribed = true;
    updateSubscribeButton();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateSubscribeButton();
  });
}
