/* Offline-Cache für die iPad-Seite: erst Netz (aktueller Stand), sonst Cache — so geht die
   Erfassung auch ohne WLAN im Klassenraum. Daten liegen nicht hier, sondern im localStorage. */
const CACHE = 'bt-ipad-v3';
const DATEIEN = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    const kopie = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, kopie)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
