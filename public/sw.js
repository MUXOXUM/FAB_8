const CACHE_NAME = 'smart-todo-cache-v1';
const FILES = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/db.js',
  '/theme.js',
  '/notification.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
