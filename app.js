const audio = document.getElementById('globalAudio');
const mini = document.getElementById('miniPlayer');
const miniTitle = document.getElementById('miniTitle');
const miniPlay = document.getElementById('miniPlay');
const miniProgress = document.getElementById('miniProgress');
const miniArt = document.getElementById('miniArt');
let activeCard = null;

const formatTime = s => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s/60), sec = Math.floor(s%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
};

function setPlayingState(card, playing){
  document.querySelectorAll('.track-card').forEach(c=>{
    if(c!==card) c.classList.remove('is-playing');
    const b = c.querySelector('.round-play,.square-play');
    if(b && c!==card) b.textContent='▶';
  });
  if(card){
    card.classList.toggle('is-playing',playing);
    const b = card.querySelector('.round-play,.square-play');
    if(b) b.textContent = playing ? '❚❚' : '▶';
  }
  miniPlay.textContent = playing ? '❚❚' : '▶';
}

async function loadAndPlay({src,title,art='',card=null}){
  const same = audio.dataset.src === src;
  if(!same){
    audio.src = src;
    audio.dataset.src = src;
    audio.dataset.title = title;
    activeCard = card;
    miniTitle.textContent = title;
    miniArt.style.backgroundImage = art ? `url("${art}")` : '';
    miniArt.querySelector('span').style.display = art ? 'none' : 'block';
    miniProgress.style.width='0%';
  } else if(card){ activeCard = card; }
  mini.classList.add('show');
  try{
    if(audio.paused){ await audio.play(); setPlayingState(activeCard,true); }
    else if(same){ audio.pause(); setPlayingState(activeCard,false); }
  }catch(e){ miniTitle.textContent='Tap play again'; }
}

document.querySelectorAll('.track-card').forEach(card=>{
  const btn = card.querySelector('.round-play,.square-play');
  btn.addEventListener('click',()=>loadAndPlay({src:card.dataset.src,title:card.dataset.title,art:card.dataset.art,card}));
});

document.querySelectorAll('[data-play]').forEach(btn=>{
  btn.addEventListener('click',()=>loadAndPlay({src:btn.dataset.play,title:btn.dataset.title,art:btn.dataset.art,card:document.querySelector(`[data-src="${btn.dataset.play}"]`)}));
});

miniPlay.addEventListener('click',async()=>{
  if(!audio.src) return;
  if(audio.paused){ try{await audio.play();setPlayingState(activeCard,true)}catch(e){} }
  else{audio.pause();setPlayingState(activeCard,false)}
});

audio.addEventListener('timeupdate',()=>{
  const pct = audio.duration ? (audio.currentTime/audio.duration)*100 : 0;
  miniProgress.style.width = `${pct}%`;
  if(activeCard){
    const fill = activeCard.querySelector('.track-line-fill');
    const time = activeCard.querySelector('.track-time');
    if(fill) fill.style.width=`${pct}%`;
    if(time) time.textContent=formatTime(audio.currentTime);
  }
});
audio.addEventListener('ended',()=>setPlayingState(activeCard,false));

const sections=[...document.querySelectorAll('.page-section')];
const nav=[...document.querySelectorAll('.nav-item')];
const obs=new IntersectionObserver(entries=>{
  const best=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!best)return;
  nav.forEach(n=>n.classList.toggle('active',n.dataset.target===best.target.id));
},{rootMargin:'-30% 0px -58% 0px',threshold:[0,.15,.45]});
sections.forEach(s=>obs.observe(s));

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}
