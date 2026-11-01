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
  if (footer) footer.textContent = 'real moments. no script. tap n see 🙏';

  const cardCopy = new Map([
    ['0', 'word first'],
    ['1', 'clearin my head'],
    ['2', "shouldn't be here... but god"],
    ['3', 'not done yet'],
    ['4', 'real life. no script.']
  ]);

  section.querySelectorAll('.daily-story').forEach(card => {
    const label = cardCopy.get(card.dataset.story);
    const small = card.querySelector('small');
    if (label && small) small.textContent = label;
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
    if (preview.readyState >= 2) tryPlay();
  }

  // Keep the existing full-screen story viewer, but use the same first-five captions there too.
  const viewerLabels = {
    'IN THE WORD': 'word first',
    'FRESH AIR': 'clearin my head',
    'ONLY BY GRACE': "shouldn't be here... but god",
    'STILL GROWING': 'not done yet',
    'LIFE LATELY': 'real life. no script.'
  };
  const viewerCaptions = {
    'word first': 'word first',
    'clearin my head': 'clearin my head',
    "shouldn't be here... but god": "shouldn't be here... but god",
    'not done yet': 'not done yet',
    'real life. no script.': 'real life. no script.'
  };
  const storyLabel = document.getElementById('storyLabel');
  const storyCaption = document.getElementById('storyCaption');

  const syncViewerCopy = () => {
    if (!storyLabel || !storyCaption) return;
    const mapped = viewerLabels[storyLabel.textContent.trim().toUpperCase()];
    if (!mapped) return;
    storyLabel.textContent = mapped;
    storyCaption.textContent = viewerCaptions[mapped];
  };

  if (storyLabel) {
    new MutationObserver(syncViewerCopy).observe(storyLabel, { childList: true, characterData: true, subtree: true });
  }
})();
