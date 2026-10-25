const CACHE='bible-and-mic-v20';
const CORE=['./','index.html','styles.css','hero-polish.css','app.js','manifest.webmanifest','home-hero.jpg','featured-cover.jpg','icon-180.png','icon-192.png','icon-512.png','in-the-word.jpg','fresh-air.jpg','only-by-grace.jpg','redeemed.jpg','life-lately-poster.jpg','little-reminders.jpg','quiet-companion.jpg','new-growth.jpg','small-beauty.jpg'];

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
  e.respondWith((async()=>{
    try{
      const r=await fetch(e.request);
      const type=r.headers.get('content-type')||'';
      if(type.includes('text/html')){
        let html=await r.text();
        if(!html.includes('hero-polish.css')) html=html.replace('</head>','<link rel="stylesheet" href="hero-polish.css?v=20"></head>');
        return new Response(html,{status:r.status,statusText:r.statusText,headers:r.headers});
      }
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return r;
    }catch(err){
      return caches.match(e.request).then(r=>r||caches.match('index.html'));
    }
  })());
});
