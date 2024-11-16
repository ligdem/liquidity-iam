const CACHE_NAME = 'liquidity-iam-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/services/communication-service.js',
  '/services/key-management-service.js',
  '/services/storage-service.js',
  '/components/app-root.js',
  '/components/contact-list.js',
  '/components/key-recovery.js',
  '/components/user-dashboard.js',
  '/components/user-login.js',
  '/components/webrtc-communication.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error('Failed to cache:', error);
      });
    })
  );
});


self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // If the request is for your domain, handle it internally
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});