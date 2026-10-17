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


// Rotating Scripture card — intentionally slow enough to read.
const verses = [
  {ref:'2 CORINTHIANS 5:17', text:'“If anyone is in Christ, the new creation has come: The old has gone, the new is here!”'},
  {ref:'PHILIPPIANS 4:13', text:'“I can do all this through him who gives me strength.”'},
  {ref:'PROVERBS 3:5–6', text:'“Trust in the LORD with all your heart and lean not on your own understanding.”'},
  {ref:'ISAIAH 41:10', text:'“Do not fear, for I am with you; do not be dismayed, for I am your God.”'},
  {ref:'PSALM 46:1', text:'“God is our refuge and strength, an ever-present help in trouble.”'},
  {ref:'ROMANS 8:28', text:'“In all things God works for the good of those who love him.”'},
  {ref:'JEREMIAH 29:11', text:'“For I know the plans I have for you,” declares the LORD.'},
  {ref:'MATTHEW 11:28', text:'“Come to me, all you who are weary and burdened, and I will give you rest.”'},
  {ref:'JOHN 3:16', text:'“For God so loved the world that he gave his one and only Son.”'},
  {ref:'ROMANS 12:2', text:'“Be transformed by the renewing of your mind.”'},
  {ref:'PSALM 23:4', text:'“I will fear no evil, for you are with me.”'},
  {ref:'2 TIMOTHY 1:7', text:'“The Spirit God gave us does not make us timid, but gives us power, love and self-discipline.”'},
  {ref:'LAMENTATIONS 3:22–23', text:'“His compassions never fail. They are new every morning; great is your faithfulness.”'},
  {ref:'MATTHEW 4:19', text:'“Come, follow me,” Jesus said, “and I will send you out to fish for people.”'},
  {ref:'JOHN 14:6', text:'“I am the way and the truth and the life.”'},
  {ref:'PSALM 34:18', text:'“The LORD is close to the brokenhearted and saves those who are crushed in spirit.”'},
  {ref:'ROMANS 5:8', text:'“While we were still sinners, Christ died for us.”'},
  {ref:'GALATIANS 2:20', text:'“I have been crucified with Christ and I no longer live, but Christ lives in me.”'}
]

const verseCard = document.getElementById('verseCard');
const verseRef = document.getElementById('verseRef');
const verseText = document.getElementById('verseText');
const verseCount = document.getElementById('verseCount');
const verseProgress = document.getElementById('verseProgress');
let verseIndex = 0;
let verseTimer;
const VERSE_MS = 8000;

function showVerse(index){
  if(!verseCard) return;
  verseIndex = (index + verses.length) % verses.length;
  verseCard.classList.add('changing');
  setTimeout(()=>{
    const v = verses[verseIndex];
    verseRef.textContent = v.ref;
    verseText.textContent = v.text;
    verseCount.textContent = `${verseIndex + 1} / ${verses.length} · NIV`;
    verseCard.classList.remove('changing');
    verseProgress.classList.remove('run');
    void verseProgress.offsetWidth;
    verseProgress.classList.add('run');
  },180);
}

function restartVerseTimer(){
  clearInterval(verseTimer);
  verseTimer = setInterval(()=>showVerse(verseIndex + 1), VERSE_MS);
}

if(verseCard){
  showVerse(0);
  restartVerseTimer();
  verseCard.addEventListener('click',()=>{ showVerse(verseIndex + 1); restartVerseTimer(); });
  verseCard.addEventListener('keydown',e=>{
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); showVerse(verseIndex + 1); restartVerseTimer(); }
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) clearInterval(verseTimer); else restartVerseTimer();
  });
}

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));}
