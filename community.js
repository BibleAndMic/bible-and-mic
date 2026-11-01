import { siteConfig } from './site-config.js';

const SITE_URL='https://bibleandmic.github.io/bible-and-mic/';

async function shareOrCopy({title,text,url}){
  if(navigator.share){
    try{await navigator.share({title,text,url});return;}catch(error){if(error?.name==='AbortError')return;}
  }
  try{
    await navigator.clipboard.writeText(url);
    return 'copied';
  }catch(_){
    window.prompt('Copy this link:',url);
  }
}

function addTrackShareButtons(){
  document.querySelectorAll('.track-card').forEach(card=>{
    if(card.querySelector('.track-share'))return;
    const title=card.dataset.title || card.querySelector('h3')?.textContent?.trim() || 'B&M track';
    const trackId=card.dataset.trackId || card.dataset.src?.replace(/\.[^.]+$/,'') || '';
    const url=new URL(SITE_URL);
    if(trackId)url.searchParams.set('track',trackId);
    const button=document.createElement('button');
    button.className='track-share';
    button.type='button';
    button.textContent='SHARE';
    button.setAttribute('aria-label',`Share ${title}`);
    button.addEventListener('click',async event=>{
      event.stopPropagation();
      const result=await shareOrCopy({title:`${title} — B&M | Bible & Mic`,text:`Listen to ${title} from B&M | Bible & Mic.`,url:url.href});
      if(result==='copied'){
        const old=button.textContent;button.textContent='COPIED';setTimeout(()=>button.textContent=old,1400);
      }
    });
    (card.querySelector('.feature-copy,.small-copy') || card).appendChild(button);
  });
}

function focusSharedTrack(){
  const id=new URL(location.href).searchParams.get('track');
  if(!id)return;
  const cards=[...document.querySelectorAll('.track-card')];
  const card=cards.find(item=>item.dataset.trackId===id || item.dataset.src?.replace(/\.[^.]+$/,'')===id);
  if(!card)return;
  window.setTimeout(()=>{
    card.scrollIntoView({behavior:'smooth',block:'center'});
    card.classList.add('deep-link-focus');
    window.setTimeout(()=>card.classList.remove('deep-link-focus'),2400);
  },350);
}

function enhanceConnect(){
  const connect=document.getElementById('connect');
  if(!connect)return;

  connect.querySelector('.latest-social')?.remove();

  const youtube=[...connect.querySelectorAll('.link-stack a')].find(link=>link.querySelector('span')?.textContent?.trim()==='YOUTUBE');
  if(youtube){
    if(siteConfig.youtubeUrl){youtube.href=siteConfig.youtubeUrl;youtube.querySelector('b').textContent='Watch on YouTube';}
    else youtube.hidden=true;
  }

  if(!connect.querySelector('.site-share')){
    const share=document.createElement('button');
    share.className='site-share';share.type='button';share.textContent='SHARE B&M ↗';
    share.addEventListener('click',async()=>{
      const result=await shareOrCopy({title:'B&M | Bible & Mic',text:'Christian hip-hop, testimony, faith, and music.',url:SITE_URL});
      if(result==='copied'){share.textContent='LINK COPIED';setTimeout(()=>share.textContent='SHARE B&M ↗',1400);}
    });
    connect.querySelector('.purpose-line')?.before(share);
  }

  if(siteConfig.newsletterEndpoint && !connect.querySelector('.release-signup')){
    const form=document.createElement('form');
    form.className='release-signup';
    form.action=siteConfig.newsletterEndpoint;
    form.method='POST';
    form.innerHTML='<div><span>GET NEW RELEASES</span><p>New music and occasional encouragement. Nothing noisy.</p></div><label><span class="sr-only">Email address</span><input type="email" name="email" autocomplete="email" placeholder="Email address" required><button type="submit">JOIN</button></label>';
    connect.querySelector('.purpose-line')?.before(form);
  }

  if(siteConfig.contactEmail && !connect.querySelector('.prayer-booking')){
    const link=document.createElement('a');
    link.className='prayer-booking';
    link.href=`mailto:${encodeURIComponent(siteConfig.contactEmail)}?subject=${encodeURIComponent('B&M — Prayer request / booking')}&body=${encodeURIComponent('Hey Corey,\n\nI’m reaching out from B&M because…\n\n')}`;
    link.textContent='SEND A PRAYER REQUEST OR BOOK ME ↗';
    connect.querySelector('.purpose-line')?.before(link);
  }
}

setTimeout(()=>{
  addTrackShareButtons();
  enhanceConnect();
  focusSharedTrack();
  import('./finish-polish.js').catch(()=>{});
  import('./daily-walk.js').catch(()=>{});
},0);
