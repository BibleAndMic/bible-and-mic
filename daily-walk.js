(() => {
  const section = document.getElementById('daily');
  if (!section) return;

  const eyebrow = section.querySelector('.daily-head .kicker');
  const headline = section.querySelector('.daily-head h2');
  const subline = section.querySelector('.daily-head > p');
  const footer = section.querySelector('.daily-note');

  if (eyebrow) eyebrow.textContent = 'daily walk';
  if (headline) headline.textContent = 'no filter... just the walk.';
  if (subline) subline.textContent = 'been through it all n still standin... glory to god. this is what it looks like day to day.';
  if (footer) footer.textContent = 'straight from my day... tap n see 🙏🏽';

  const exactCardCopy = new Map([
    ['0', 'word first'],
    ['1', 'clearin my head'],
    ['2', "shouldn't be here... but god"],
    ['3', 'not done yet'],
    ['4', "life lately... ain't always pretty"]
  ]);

  section.querySelectorAll('.daily-story').forEach(card => {
    const small = card.querySelector('small');
    if (!small) return;
    const exact = exactCardCopy.get(card.dataset.story);
    small.textContent = exact || small.textContent.trim().toLowerCase();
  });

  const preview = section.querySelector('.daily-story[data-story="4"] video');
  if (preview) {
    preview.muted = true;
    preview.defaultMuted = true;
    preview.loop = true;
    preview.autoplay = true;
    preview.playsInline = true;
    preview.preload = 'metadata';
    preview.setAttribute('muted', '');
    preview.setAttribute('loop', '');
    preview.setAttribute('autoplay', '');
    preview.setAttribute('playsinline', '');
    const tryPlay = () => preview.play().catch(() => {});
    preview.addEventListener('loadeddata', tryPlay, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && preview.paused) tryPlay();
    });
    if (preview.readyState >= 2) tryPlay();
  }

  // Keep the existing story viewer and mirror the first-five Daily Walk captions there.
  const viewerLabels = {
    'IN THE WORD': 'word first',
    'FRESH AIR': 'clearin my head',
    'ONLY BY GRACE': "shouldn't be here... but god",
    'STILL GROWING': 'not done yet',
    'LIFE LATELY': "life lately... ain't always pretty"
  };
  const storyLabel = document.getElementById('storyLabel');
  const storyCaption = document.getElementById('storyCaption');

  const syncViewerCopy = () => {
    if (!storyLabel || !storyCaption) return;
    const mapped = viewerLabels[storyLabel.textContent.trim().toUpperCase()];
    if (!mapped) return;
    storyLabel.textContent = mapped;
    storyCaption.textContent = mapped;
  };

  if (storyLabel) {
    new MutationObserver(syncViewerCopy).observe(storyLabel, { childList: true, characterData: true, subtree: true });
  }
})();
