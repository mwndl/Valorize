self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('valorize-cache').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/script.js',
          '/images/favicon_round/android-chrome-192x192.png',
          '/images/favicon_round/android-chrome-512x512.png',
          '/charts/charts.css',
          '/translations.js',
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
  