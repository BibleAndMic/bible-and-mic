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
    miniArt.style.backgroundImage = art ? `url(\"${art}\")` : '';
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
  btn.addEventListener('click',()=>loadAndPlay({src:btn.dataset.play,title:btn.dataset.title,art:btn.dataset.art,card:document.querySelector(`[data-src=\"${btn.dataset.play}\"]`)}));
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
const verseProgress = document.getElementById('verseProgress');
let verseIndex = 0;
let verseTimer;
const VERSE_MS = 12000;

function showVerse(index){
  if(!verseCard) return;
  verseIndex = (index + verses.length) % verses.length;
  verseCard.classList.add('changing');
  setTimeout(()=>{
    const v = verses[verseIndex];
    verseRef.textContent = v.ref;
    verseText.textContent = v.text;
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

// Daily Walk — lightweight story viewer. Photos advance slowly; video stays permanently muted.
const dailyStories = [
  {type:'image',src:'in-the-word.jpg',label:'IN THE WORD',caption:'Still learning.'},
  {type:'image',src:'fresh-air.jpg',label:'FRESH AIR',caption:'Grateful for simple moments.'},
  {type:'image',src:'only-by-grace.jpg',label:'ONLY BY GRACE',caption:'Nothing to prove. Everything to thank Him for.'},
  {type:'image',src:'redeemed.jpg',label:'STILL GROWING',caption:'Trying to keep Christ at the center.'},
  {type:'video',src:'life-lately.mp4',label:'LIFE LATELY',caption:'One day at a time.'},
  {type:'image',src:'little-reminders.jpg',label:'LITTLE THINGS',caption:'Small reminders. Big grace.'},
  {type:'image',src:'quiet-companion.jpg',label:'QUIET MOMENTS',caption:'God has been good.'},
  {type:'image',src:'new-growth.jpg',label:'NEW GROWTH',caption:'Still growing.'},
  {type:'image',src:'small-beauty.jpg',label:'SMALL BEAUTY',caption:'His fingerprints are everywhere.'}
];
const storyViewer=document.getElementById('storyViewer');
const storyStage=document.getElementById('storyStage');
const storyLabel=document.getElementById('storyLabel');
const storyCaption=document.getElementById('storyCaption');
const storyProgress=document.getElementById('storyProgress');
const storySound=document.getElementById('storySound');
if(storySound){storySound.hidden=true;storySound.style.display='none';storySound.setAttribute('aria-hidden','true');storySound.tabIndex=-1;}
let storyIndex=0, storyTimer=null, storyVideo=null;
const PHOTO_MS=8000;
function buildStoryProgress(){
  storyProgress.innerHTML=dailyStories.map((_,i)=>`<span data-p=\"${i}\"><i></i></span>`).join('');
}
function setStoryProgress(ms){
  [...storyProgress.children].forEach((el,i)=>{el.className=i<storyIndex?'done':i===storyIndex?'active':'';el.style.setProperty('--story-ms',`${ms}ms`);});
}
function clearStoryMedia(){
  clearTimeout(storyTimer);
  if(storyVideo){storyVideo.muted=true;storyVideo.pause();storyVideo=null;}
  storyViewer.classList.remove('has-video');
}
function showStory(i){
  clearStoryMedia();
  storyIndex=(i+dailyStories.length)%dailyStories.length;
  const item=dailyStories[storyIndex];
  storyLabel.textContent=item.label;
  storyCaption.textContent=item.caption;
  storyStage.innerHTML='';
  if(item.type==='video'){
    const v=document.createElement('video');
    v.src=item.src;v.playsInline=true;v.muted=true;v.defaultMuted=true;v.autoplay=true;v.controls=false;v.preload='auto';v.volume=0;
    v.addEventListener('volumechange',()=>{if(!v.muted || v.volume!==0){v.muted=true;v.volume=0;}});
    storyStage.appendChild(v);storyVideo=v;storyViewer.classList.add('has-video');
    v.addEventListener('loadedmetadata',()=>setStoryProgress(Math.max(3000,Math.min((v.duration||12)*1000,20000))));
    v.addEventListener('ended',()=>showStory(storyIndex+1));
    v.play().catch(()=>{});
  }else{
    const img=document.createElement('img');img.src=item.src;img.alt=item.label;storyStage.appendChild(img);
    setStoryProgress(PHOTO_MS);storyTimer=setTimeout(()=>showStory(storyIndex+1),PHOTO_MS);
  }
}
function openStory(i){
  buildStoryProgress();storyViewer.classList.add('open');storyViewer.setAttribute('aria-hidden','false');document.body.classList.add('story-open');showStory(i);
}
function closeStory(){
  clearStoryMedia();storyViewer.classList.remove('open','has-video');storyViewer.setAttribute('aria-hidden','true');document.body.classList.remove('story-open');storyStage.innerHTML='';
}
document.querySelectorAll('[data-story]').forEach(btn=>btn.addEventListener('click',()=>openStory(Number(btn.dataset.story))));
document.getElementById('storyClose')?.addEventListener('click',closeStory);
document.getElementById('storyPrev')?.addEventListener('click',()=>showStory(storyIndex-1));
document.getElementById('storyNext')?.addEventListener('click',()=>showStory(storyIndex+1));
document.addEventListener('keydown',e=>{if(!storyViewer?.classList.contains('open'))return;if(e.key==='Escape')closeStory();if(e.key==='ArrowRight')showStory(storyIndex+1);if(e.key==='ArrowLeft')showStory(storyIndex-1);});

// Song title + producer credit refresh
const featuredTrack = document.querySelector('.feature-track');
if(featuredTrack){
  featuredTrack.dataset.title = "He's Working on Me";
  const title = featuredTrack.querySelector('h3');
  const credit = featuredTrack.querySelector('.feature-copy > p');
  const play = featuredTrack.querySelector('.round-play');
  if(title) title.textContent = "He’s Working on Me";
  if(credit) credit.textContent = 'Prod. by Syndrome';
  if(play) play.setAttribute('aria-label', "Play He's Working on Me");
}

const heroPlay = document.querySelector('[data-play=\"featured-song.mp3\"]');
if(heroPlay) heroPlay.dataset.title = "He's Working on Me";

const good2MeTrack = document.querySelector('.track-card.g2m');
if(good2MeTrack){
  good2MeTrack.dataset.title = 'Good2Me';
  const title = good2MeTrack.querySelector('h3');
  const credit = good2MeTrack.querySelector('.small-copy > p');
  const play = good2MeTrack.querySelector('.square-play');
  if(title) title.textContent = 'Good2Me';
  if(credit) credit.textContent = 'Prod. by Jake Angel';
  if(play) play.setAttribute('aria-label', 'Play Good2Me');
}

const c4cTrack = document.querySelector('.track-card.c4c');
if(c4cTrack){
  c4cTrack.dataset.title = 'Crazy 4 Christ';
  const title = c4cTrack.querySelector('h3');
  const credit = c4cTrack.querySelector('.small-copy > p');
  const play = c4cTrack.querySelector('.square-play');
  if(title) title.textContent = 'Crazy 4 Christ';
  if(credit) credit.textContent = 'Prod. by Morgan';
  if(play) play.setAttribute('aria-label', 'Play Crazy 4 Christ');
}

const videoTitle = document.querySelector('.video-meta span');
if(videoTitle) videoTitle.textContent = 'CRAZY 4 CHRIST · PROD. BY MORGAN';

// Seamless marquee: duplicate the phrase sequence and translate by the exact
// distance between the two copies. This prevents both blank gaps and snap-backs.
const marqueeTrack = document.querySelector('.marquee > div');
if(marqueeTrack && !marqueeTrack.dataset.seamless){
  marqueeTrack.dataset.seamless = 'true';
  marqueeTrack.style.animation = 'none';

  const originals = [...marqueeTrack.children];
  const originalWidth = marqueeTrack.getBoundingClientRect().width;
  originals.forEach(node=>{
    const clone = node.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    marqueeTrack.appendChild(clone);
  });

  const first = marqueeTrack.children[0];
  const secondStart = marqueeTrack.children[originals.length];
  const loopDistance = secondStart.offsetLeft - first.offsetLeft;

  // Match the old marquee's apparent speed: it moved half of the original
  // track width in 22 seconds, so preserve that pixels-per-second rate.
  const oldPixelsPerMs = Math.max(originalWidth / 44000, 0.01);
  const loopDuration = loopDistance / oldPixelsPerMs;
  marqueeTrack.style.willChange = 'transform';

  let start = null;
  const tick = now=>{
    if(start===null) start = now;
    const progress = ((now - start) % loopDuration) / loopDuration;
    marqueeTrack.style.transform = `translate3d(${-loopDistance * progress}px,0,0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// YouVersion Bible App resource card — option 2 treatment.
const heroContent = document.querySelector('.hero .hero-content');
if(heroContent && !heroContent.querySelector('.bible-app-card')){
  const card = document.createElement('a');
  card.className = 'bible-app-card';
  card.href = 'https://apps.apple.com/us/app/bible/id282935706';
  card.target = '_blank';
  card.rel = 'noopener';
  card.setAttribute('aria-label','Get the free YouVersion Bible App on the App Store');
  card.innerHTML = `
    <span class="bible-app-icon" aria-hidden="true">
      <svg viewBox="0 0 48 40" focusable="false" aria-hidden="true">
        <path d="M23.5 34.5c-5.2-4.6-11.6-5.6-18-3.8V6.8c6.8-1.8 13.2-.4 18 4.2v23.5Z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/>
        <path d="M24.5 34.5c5.2-4.6 11.6-5.6 18-3.8V6.8c-6.8-1.8-13.2-.4-18 4.2v23.5Z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/>
        <path d="M24 11v23" stroke="currentColor" stroke-width="1.7"/>
      </svg>
    </span>
    <span class="bible-app-copy">
      <strong>READ THE WORD</strong>
      <span>Take God’s Word with you.</span>
      <small>YouVersion Bible App</small>
    </span>
    <span class="bible-app-button">GET THE FREE<br>BIBLE APP <b>→</b></span>
  `;
  const heroLine = heroContent.querySelector('p');
  heroContent.insertBefore(card, heroLine || null);
}
