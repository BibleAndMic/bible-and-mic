// B&M progressive enhancements — additive, static-host friendly, and easy to roll back.
(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'enhancements.css';
  document.head.appendChild(css);

  // Lightweight loading + basic accessibility hygiene.
  document.querySelectorAll('img').forEach(img => {
    img.decoding = 'async';
    if (!img.closest('.feature-art')) img.loading = 'lazy';
  });
  const featuredImage = document.querySelector('.feature-art img');
  if (featuredImage) featuredImage.fetchPriority = 'high';
  document.querySelectorAll('button').forEach(button => {
    if (!button.getAttribute('type')) button.type = 'button';
  });
  document.querySelectorAll('.daily-story').forEach(button => {
    const label = button.querySelector('small')?.textContent?.trim();
    if (label && !button.getAttribute('aria-label')) button.setAttribute('aria-label', `Open Daily Walk: ${label}`);
  });
  const syncNavState = () => document.querySelectorAll('.nav-item').forEach(item => {
    if (item.classList.contains('active')) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  syncNavState();
  document.querySelectorAll('.nav-item').forEach(item => new MutationObserver(syncNavState).observe(item,{attributes:true,attributeFilter:['class']}));

  // Existing free Bible access: keep YouVersion, but make the Bible tab open inside B&M first.
  const bibleUrl = 'https://www.youversion.com/bible-app';
  const bibleCard = document.querySelector('.bible-app-card');
  if (bibleCard) {
    bibleCard.id = 'bible';
    bibleCard.href = '#bible';
    bibleCard.removeAttribute('target');
    bibleCard.removeAttribute('rel');
    bibleCard.setAttribute('aria-label', 'Open Bible access');
    const button = bibleCard.querySelector('.bible-app-button');
    if (button) button.innerHTML = 'OPEN FREE<br>BIBLE <b>→</b>';
  }

  const sheet = document.createElement('div');
  sheet.className = 'bible-sheet';
  sheet.id = 'bibleSheet';
  sheet.setAttribute('aria-hidden','true');
  sheet.innerHTML = `
    <div class="bible-panel" role="dialog" aria-modal="true" aria-label="Free Bible access">
      <div class="bible-panel-head">
        <div><span class="kicker">READ THE WORD</span><h3>Free Bible.</h3></div>
        <button class="bible-close" type="button" aria-label="Close Bible access">×</button>
      </div>
      <p>B&M keeps your Bible access simple. Open the free YouVersion Bible when you’re ready to read.</p>
      <a class="bible-open" href="${bibleUrl}">OPEN YOUVERSION BIBLE →</a>
      <p class="bible-note">YouVersion is an external Bible service. Opening it leaves the B&M page, but the Bible tab itself stays inside B&M.</p>
    </div>`;
  document.body.appendChild(sheet);

  const showBible = () => {
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    sheet.querySelector('.bible-close')?.focus();
  };
  const hideBible = () => {
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  const bibleNav = document.querySelector('.nav-item[data-bible-nav]');
  bibleNav?.addEventListener('click', event => {
    event.preventDefault();
    showBible();
  });
  bibleCard?.addEventListener('click', event => {
    event.preventDefault();
    showBible();
  });
  sheet.querySelector('.bible-close')?.addEventListener('click', hideBible);
  sheet.addEventListener('click', event => { if (event.target === sheet) hideBible(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && sheet.classList.contains('open')) hideBible(); });

  import('./tracks.js').then(({ tracks }) => {
    if (!Array.isArray(tracks) || !tracks.length) return;

    const audio = document.getElementById('globalAudio');
    const mini = document.getElementById('miniPlayer');
    const miniCopy = mini?.querySelector('.mini-copy');
    const miniTitle = document.getElementById('miniTitle');
    const music = document.getElementById('music');
    const feature = music?.querySelector('.feature-track');
    const grid = music?.querySelector('.song-grid');
    const count = music?.querySelector('.section-head .count');
    const latest = document.querySelector('[data-play]');
    let currentTrackIndex = -1;
    let nextPreloader = null;

    const byAudio = src => {
      if (!src) return null;
      const file = decodeURIComponent(new URL(src, location.href).pathname.split('/').pop());
      return tracks.find((track, index) => {
        if (track.audio === file) currentTrackIndex = index;
        return track.audio === file;
      }) || null;
    };

    const monogramMarkup = track => `<div class="letter-art"><span>${track.monogram || 'B&M'}</span><div class="bars"><i></i><i></i><i></i><i></i><i></i></div></div>`;

    const bindTrackButton = card => {
      const button = card.querySelector('.round-play,.square-play');
      button?.addEventListener('click', () => {
        const art = card.dataset.art || '';
        if (typeof window.loadAndPlay === 'function') {
          window.loadAndPlay({ src: card.dataset.src, title: card.dataset.title, art, card });
        }
      });
    };

    const featured = tracks[0];
    if (feature) {
      feature.dataset.src = featured.audio;
      feature.dataset.title = featured.title;
      feature.dataset.art = featured.cover || '';
      const image = feature.querySelector('.feature-art img');
      if (image && featured.cover) {
        image.src = featured.cover;
        image.alt = `${featured.title} cover art`;
        image.decoding = 'async';
        image.fetchPriority = 'high';
      }
      const title = feature.querySelector('h3');
      const producer = feature.querySelector('.feature-copy > p');
      const play = feature.querySelector('.round-play');
      if (title) title.textContent = featured.title;
      if (producer) producer.textContent = `Prod. by ${featured.producer}`;
      if (play) play.setAttribute('aria-label', `Play ${featured.title}`);
      const old = feature.querySelector('.round-play');
      const replacement = old?.cloneNode(true);
      if (old && replacement) {
        old.replaceWith(replacement);
        bindTrackButton(feature);
      }
    }

    if (grid) {
      grid.innerHTML = tracks.slice(1).map(track => `
        <article class="track-card small-track" data-track-id="${track.id}" data-src="${track.audio}" data-title="${track.title.replace(/"/g,'&quot;')}" data-art="${track.cover || ''}">
          ${monogramMarkup(track)}
          <div class="small-copy"><span class="release-tag">RELEASE</span><h3>${track.title}</h3><p>Prod. by ${track.producer}</p></div>
          <button type="button" class="square-play" aria-label="Play ${track.title}">▶</button>
        </article>`).join('');
      grid.querySelectorAll('.track-card').forEach(bindTrackButton);
    }

    if (count) count.textContent = `${String(tracks.length).padStart(2,'0')} TRACKS`;
    if (latest) {
      latest.dataset.play = featured.audio;
      latest.dataset.title = featured.title;
      latest.dataset.art = featured.cover || '';
    }

    if (miniCopy && !miniCopy.querySelector('.mini-seek')) {
      const seek = document.createElement('div');
      seek.className = 'mini-seek';
      seek.innerHTML = '<time class="mini-current">0:00</time><input class="mini-range" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek through current track"><time class="mini-duration">0:00</time>';
      miniCopy.appendChild(seek);
    }

    const range = miniCopy?.querySelector('.mini-range');
    const current = miniCopy?.querySelector('.mini-current');
    const duration = miniCopy?.querySelector('.mini-duration');
    const format = seconds => {
      if (!Number.isFinite(seconds)) return '0:00';
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${minutes}:${secs}`;
    };

    const updateSeek = () => {
      if (!audio || !range) return;
      const pct = audio.duration ? audio.currentTime / audio.duration : 0;
      range.value = String(Math.round(pct * 1000));
      range.style.setProperty('--seek', `${pct * 100}%`);
      if (current) current.textContent = format(audio.currentTime);
      if (duration) duration.textContent = format(audio.duration);
      if ('mediaSession' in navigator && Number.isFinite(audio.duration)) {
        try {
          navigator.mediaSession.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate || 1, position: Math.min(audio.currentTime, audio.duration) });
        } catch (_) {}
      }
    };

    range?.addEventListener('input', () => {
      if (!audio?.duration) return;
      audio.currentTime = (Number(range.value) / 1000) * audio.duration;
      updateSeek();
    });
    audio?.addEventListener('timeupdate', updateSeek);
    audio?.addEventListener('durationchange', updateSeek);
    audio?.addEventListener('loadedmetadata', updateSeek);

    const preloadNext = index => {
      const next = tracks[index + 1];
      if (!next) return;
      nextPreloader = new Audio();
      nextPreloader.preload = 'metadata';
      nextPreloader.src = next.audio;
      nextPreloader.load();
    };

    const setMediaMetadata = track => {
      if (!('mediaSession' in navigator) || !track) return;
      const artwork = new URL(track.cover || 'icon-512.png', location.href).href;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: `B&M · Prod. by ${track.producer}`,
        album: 'Bible & Mic',
        artwork: [{ src: artwork, sizes: '512x512' }]
      });
    };

    const playIndex = index => {
      if (index < 0 || index >= tracks.length) return;
      const track = tracks[index];
      currentTrackIndex = index;
      const card = music?.querySelector(`[data-src="${CSS.escape(track.audio)}"]`);
      if (typeof window.loadAndPlay === 'function') {
        window.loadAndPlay({ src: track.audio, title: track.title, art: track.cover || '', card });
      } else if (audio) {
        audio.src = track.audio;
        audio.dataset.src = track.audio;
        audio.dataset.title = track.title;
        audio.play().catch(() => {});
      }
      setMediaMetadata(track);
      preloadNext(index);
    };

    audio?.addEventListener('play', () => {
      const track = byAudio(audio.dataset.src || audio.currentSrc || audio.src);
      setMediaMetadata(track);
      if (currentTrackIndex >= 0) preloadNext(currentTrackIndex);
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    });
    audio?.addEventListener('pause', () => {
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    });
    audio?.addEventListener('ended', () => {
      if (currentTrackIndex >= 0 && currentTrackIndex < tracks.length - 1) playIndex(currentTrackIndex + 1);
    });

    if ('mediaSession' in navigator) {
      const handlers = {
        play: () => audio?.play(),
        pause: () => audio?.pause(),
        previoustrack: () => playIndex(Math.max(0, currentTrackIndex - 1)),
        nexttrack: () => playIndex(Math.min(tracks.length - 1, currentTrackIndex + 1)),
        seekbackward: details => { if (audio) audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10)); },
        seekforward: details => { if (audio?.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + (details.seekOffset || 10)); },
        seekto: details => { if (audio && Number.isFinite(details.seekTime)) audio.currentTime = details.seekTime; }
      };
      Object.entries(handlers).forEach(([action, handler]) => {
        try { navigator.mediaSession.setActionHandler(action, handler); } catch (_) {}
      });
    }

    if (miniTitle) miniTitle.setAttribute('aria-live', 'polite');
  }).catch(() => {});
})();
