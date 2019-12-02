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

  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('/screens/online/notifications.html')
  );
});

self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly:true,
      applicationServerKey:baseToArray(publicKey)
    })
    .then((newSubscription) => {
      console.log('[Service Worker] New subscription: ', newSubscription);
    })
  );
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
          unsubscribeFromNotifications();
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
    applicationServerKey:baseToArray(publicKey)
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

function unsubscribeFromNotifications() {
  registration.pushManager.getSubscription()
  .then((subscription) => {
    if(subscription){
      return subscription.unsubscribe();
    }
  })
  .catch((error) => {
    console.log('Error unsubscribing', error);
  })
  .then(() => {
    console.log('User is unsubscribed.');
    isSubscribed = false;
    updateSubscribeButton();
  });
}


function baseToArray(string){
  const padding = '='.repeat((4 - string.length % 4) % 4);
  const base64 = (string + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
