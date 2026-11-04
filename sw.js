const CACHE = 'stempeluhr-v14';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache:'reload'}))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
// Immer zuerst die aktuelle Version vom Server holen (am Browser-Zwischenspeicher vorbei); offline aus dem Cache.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request, {cache:'no-cache'}).then(r => { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match('./index.html'))));
});
