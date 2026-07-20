const CACHE = 'wisa-v1'
const ASSETS = ['/', '/invoice', '/manifest.json']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  )
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone()
      if (res.ok && e.request.url.startsWith(self.location.origin)) {
        caches.open(CACHE).then((cache) => cache.put(e.request, copy))
      }
      return res
    }))
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
})
