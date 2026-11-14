// Decants — offline cache.
// To ship an update: change the app files, bump VERSION, push. Open apps then show "Atualizar app".
// Your data lives in localStorage and is never touched by updates.
// The Fiado app lives on the same site (github.io), so this worker only ever touches caches named "decants-*".
const VERSION = 'decants-v4';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c =>
    Promise.all(SHELL.map(u => fetch(u, { cache: 'reload' }).then(r => { if (!r.ok) throw new Error(u); return c.put(u, r); })))
  ));
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('decants-') && k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The page: always the version this worker shipped, so it only changes after "Atualizar app".
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.open(VERSION).then(c => c.match('./index.html')).then(hit => hit || fetch(req))
    );
    return;
  }

  const sameOrigin = url.origin === location.origin;
  const inScope = sameOrigin && url.href.startsWith(self.registration.scope);
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!inScope && !font) return;
  if (inScope && url.pathname.endsWith('/sw.js')) return;

  e.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(req, { ignoreSearch: inScope }).then(hit => {
        if (hit && inScope) return hit;
        const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    )
  );
});
