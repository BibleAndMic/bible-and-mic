const CACHE='bible-and-mic-v11';
const CORE=['./','index.html','styles.css','app.js','manifest.webmanifest','home-hero.jpg','featured-cover.jpg','icon-180.png','icon-192.png','icon-512.png'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;

  const url = new URL(e.request.url);

  // Daily Walk files were uploaded to the repo root on iPhone.
  // Transparently map /daily/file.jpg -> /file.jpg so both the
  // story thumbnails and full-screen story viewer work.
  if(url.origin === self.location.origin && url.pathname.includes('/daily/')){
    const fixedPath = url.pathname.replace('/daily/','/');
    const fixedUrl = new URL(fixedPath + url.search, url.origin);
    e.respondWith(
      fetch(fixedUrl).then(r=>{
        if(!r.ok) throw new Error('Daily media not found');
        return r;
      })
    );
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return r;
      })
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
  );
});
