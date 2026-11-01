(() => {
  if (document.getElementById('bmFinishPolish')) return;

  const style = document.createElement('style');
  style.id = 'bmFinishPolish';
  style.textContent = `
    :root{
      --bm-gold:#e7c66f;
      --bm-border:#5a4d31;
      --bm-radius:8px;
    }

    .romans-mini-card,.bible-app-card,.feature-track,.small-track,.story-card,.video-shell,.coming-card,.release-signup{
      border-radius:var(--bm-radius)!important;
    }

    .romans-mini-card,.bible-app-card{
      border-color:#b98c35!important;
      box-shadow:0 0 0 1px rgba(0,0,0,.58),0 10px 28px rgba(0,0,0,.34),0 0 18px rgba(231,198,111,.07)!important;
    }

    .romans-dots{display:inline-flex;align-items:center;gap:3px;margin-left:2px}
    .romans-dots i{width:4px;height:4px;border-radius:50%;background:#45413a;display:block;transition:background .16s ease,transform .16s ease}
    .romans-dots i.active{background:var(--bm-gold);transform:scale(1.08)}

    .nav-line-icon{font-size:0!important;line-height:0!important;width:20px;height:20px;display:grid!important;place-items:center!important}
    .nav-line-icon svg{width:18px;height:18px;display:block;overflow:visible}
    .nav-line-icon svg path{fill:none;stroke:currentColor;stroke-width:1.55;stroke-linecap:round;stroke-linejoin:round}
    .nav-item[data-target="music"] .nav-line-icon svg path{fill:currentColor;stroke:none}

    .track-share,.site-share,.prayer-booking{
      border-color:#3b362d!important;
      transition:border-color .16s ease,background .16s ease,color .16s ease,transform .16s ease;
    }
    .track-share:active,.site-share:active,.prayer-booking:active{transform:translateY(1px)}

    .feature-track{transition:border-color .22s ease,box-shadow .22s ease,transform .22s ease}
    .track-card.deep-link-focus{
      border-color:#b98c35!important;
      box-shadow:0 0 0 1px rgba(231,198,111,.24),0 0 28px rgba(231,198,111,.12)!important;
      transform:translateY(-1px);
    }

    .feature-copy .release-tag{color:var(--bm-gold)!important;letter-spacing:.16em}
    .small-track .release-tag{letter-spacing:.14em}

    .bible-open{border-radius:var(--bm-radius);text-decoration:none}
    .bible-close{display:grid;place-items:center}

    @media(prefers-reduced-motion:reduce){
      .romans-dots i,.track-share,.site-share,.prayer-booking,.feature-track{transition:none!important}
      .track-card.deep-link-focus{transform:none}
    }
  `;
  document.head.appendChild(style);

  // The Bible tab and hero Bible card already open the same local sheet.
  // Keep B&M available behind the explicit external YouVersion action.
  const externalBible = document.querySelector('.bible-open');
  if (externalBible) {
    externalBible.target = '_blank';
    externalBible.rel = 'noopener';
  }
})();
