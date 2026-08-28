const CACHE = 'how-it-runs-v3';
const CORE = ['/', '/privacy/', '/terms/', '/legal.css', '/favicon.svg', '/hero-768.webp'];

function isStaticAsset(request) {
  const { pathname } = new URL(request.url);
  return pathname.startsWith('/assets/') || /\.(?:avif|css|gif|ico|jpe?g|js|mjs|png|svg|webp)$/i.test(pathname);
}

async function cacheResponse(request, response) {
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    const shell = await fetch('/', { cache: 'no-store' });
    if (!shell.ok) throw new Error('Could not precache the app shell.');
    const html = await shell.clone().text();
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map((match) => match[1]);
    await cache.put('/', shell);
    await cache.addAll(assets);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => cacheResponse(event.request, response))
        .catch(async () => (await caches.match(event.request)) || caches.match('/')),
    );
    return;
  }
  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => cacheResponse(event.request, response))),
    );
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => cacheResponse(event.request, response))
      .catch(() => caches.match(event.request)),
  );
});
