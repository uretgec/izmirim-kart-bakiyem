var GHPATH = '/izmirim-kart-bakiyem';
var APP_PREFIX = 'izmkbs_';
var VERSION = 'version_1.0.7';
var URLS = [
  `${GHPATH}/`,
  `${GHPATH}/index.html`,
  `${GHPATH}/assets/css/fonts/bootstrap-icons.woff`,
  `${GHPATH}/assets/css/fonts/bootstrap-icons.woff2`,
  `${GHPATH}/assets/css/bootstrap-icons.min.css`,
  `${GHPATH}/assets/css/bootstrap.min.css`,
  // `${GHPATH}/assets/img/icon-192x192.png`,
  // `${GHPATH}/assets/img/icon-512x512.png`,
  `${GHPATH}/assets/js/mask.alpine.min.js`,
  `${GHPATH}/assets/js/csp.alpine.min.js`,
  `${GHPATH}/assets/js/main.js`,
]

var CACHE_NAME = APP_PREFIX + VERSION
self.addEventListener('fetch', function (e) {
  // console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { 
        // console.log('Responding with cache : ' + e.request.url);
        return request
      } else {
        // console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  )
})

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          // console.log('Deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})