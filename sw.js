// Работа без интернета: свои файлы — сначала из сети (свежая версия), без сети — из кэша. Шрифты — из кэша.
const CACHE = 'english-1.0.0';
const V = '?v=1.0.0';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-512.png'].concat(
  ['data_words','data_content','course_data','core','lang','course','tab_home','tab_sounds','tab_words','tab_talk','tab_read','tab_rules','tab_stats','main'].map(f => 'js/' + f + '.js' + V));
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('english-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  } else if (/fonts\.(googleapis|gstatic)\.com/.test(url.host)) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(n => { const cp = n.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return n; })));
  }
});
