var CORE_CACHE_NAME = 'my-site-cache-v2';
var urlsToCache = [
  '/',
  '/css/style.css',
  '/js/script.js',
  '/offline'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CORE_CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      }).then(()=>{
        self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CORE_CACHE_NAME).then(cache => {
        return cache.match(event.request)
            .then(response => {
                if(response) {

                return response
                }
                return fetch(event.request)
                .then(response => {
                    cache.put(event.request, response.clone())
                    return response
                })
            }).catch((err) => {
                return caches.open(CORE_CACHE_NAME).then(cache => cache.match('/offline'))
            })
    })
)
})