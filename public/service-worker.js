self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('valorize-cache').then(cache => {
      return cache.addAll([
        '/',
        '/public/' // Adiciona toda a pasta 'public'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});