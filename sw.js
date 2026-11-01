const VERSION='bible-and-mic-v67';
const SHELL_CACHE=`${VERSION}-shell`;
const RUNTIME_CACHE=`${VERSION}-runtime`;
const AUDIO_CACHE='bible-and-mic-audio-v1';

const APP_SHELL=[
  './',
  'index.html',
  'styles.css',
  'base-styles.css',
  'hero-polish.css',
  'enhancements.css',
  'app.js',
  'enhancements.js',
  'tracks.js',
  'manifest.webmanifest',
  'background.jpg',
  'faith-over-fear.svg',
  'home-hero.jpg',
  'featured-cover.jpg',
  'stars-in-the-sky-cover.jpg',
  'icon.svg',
  'icon-180.png',
  'icon-192.png',
  'icon-512.png',
  'in-the-word.jpg',
  'fresh-air.jpg',
  'only-by-grace.jpg',
  'redeemed.jpg',
  'life-lately-poster.jpg',
  'little-reminders.jpg',
  'quiet-companion.jpg',
  'new-growth.jpg',
  'small-beauty.jpg'
];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(SHELL_CACHE).then(cache=>cache.addAll(APP_SHELL)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==SHELL_CACHE && key!==RUNTIME_CACHE && key!==AUDIO_CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('message',event=>{
  if(event.data?.type!=='CACHE_AUDIO' || !event.data.url) return;
  event.waitUntil((async()=>{
    try{
      const url=new URL(event.data.url,self.location.href).href;
      const cache=await caches.open(AUDIO_CACHE);
      if(await cache.match(url)) return;
      const response=await fetch(url,{cache:'no-store'});
      if(response.ok) await cache.put(url,response.clone());
    }catch(_){}
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  const sameOrigin=url.origin===self.location.origin;

  if(sameOrigin && /\.(mp3|m4a|wav|ogg)$/i.test(url.pathname)){
    event.respondWith((async()=>{
      const audioCache=await caches.open(AUDIO_CACHE);
      const cached=await audioCache.match(url.href);
      if(cached) return cached;
      try{return await fetch(event.request);}catch(_){return new Response('This track needs an internet connection the first time you play it.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}
    })());
    return;
  }

  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request);
        const cache=await caches.open(RUNTIME_CACHE);
        cache.put(event.request,fresh.clone());
        return fresh;
      }catch(_){return (await caches.match(event.request)) || (await caches.match('./')) || (await caches.match('index.html'));}
    })());
    return;
  }

  if(sameOrigin){
    event.respondWith((async()=>{
      const cached=await caches.match(event.request);
      if(cached){
        event.waitUntil(fetch(event.request).then(async fresh=>{if(fresh.ok){const cache=await caches.open(RUNTIME_CACHE);await cache.put(event.request,fresh.clone());}}).catch(()=>{}));
        return cached;
      }
      try{
        const fresh=await fetch(event.request);
        if(fresh.ok){const cache=await caches.open(RUNTIME_CACHE);cache.put(event.request,fresh.clone());}
        return fresh;
      }catch(_){return new Response('Internet connection required for this item.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}
    })());
  }
});
