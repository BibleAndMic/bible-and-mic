(() => {
  // The earlier full-width Romans Road is intentionally removed from the flow.
  // The replacement lives inside the existing hero and never changes the background.
  document.getElementById('romansRoad')?.remove();

  const heroContent = document.querySelector('.hero .hero-content');
  if (!heroContent || heroContent.querySelector('.romans-mini-card')) return;

  const frames = [
    {
      progress: 'START',
      title: 'THE ROMANS ROAD',
      text: 'The Gospel in 5 key Scriptures.'
    },
    {
      progress: '1/5',
      title: 'Romans 3:23',
      text: "We've all missed the mark and fall short of God's standard."
    },
    {
      progress: '2/5',
      title: 'Romans 6:23',
      text: 'The price of sin is separation, but the gift is eternal life.'
    },
    {
      progress: '3/5',
      title: 'Romans 5:8',
      text: 'God demonstrated His love by sending Jesus while we were still sinners.'
    },
    {
      progress: '4/5',
      title: 'Romans 10:9–10',
      text: 'Believe in your heart that God raised Him from the dead and confess Jesus as Lord.'
    },
    {
      progress: '5/5',
      title: 'Romans 10:13',
      text: 'Everyone who calls on the name of the Lord will be saved.'
    },
    {
      progress: 'TODAY',
      title: 'WHAT IT MEANS',
      text: "You don't need perfect words. Call on Jesus honestly, trust Him, and follow Him from here."
    }
  ];

  const card = document.createElement('section');
  card.className = 'romans-mini-card';
  card.setAttribute('aria-label', 'Romans Road, step-by-step Gospel summary');
  card.innerHTML = `
    <span class="romans-mini-icon" aria-hidden="true">
      <svg viewBox="0 0 28 28" focusable="false" aria-hidden="true">
        <path d="M14 4v20M8.5 10.5h11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </span>
    <span class="romans-mini-copy" aria-live="polite">
      <span class="romans-mini-meta"><b id="romansMiniProgress">START</b><i>NIV</i></span>
      <strong id="romansMiniTitle">THE ROMANS ROAD</strong>
      <span id="romansMiniText">The Gospel in 5 key Scriptures.</span>
    </span>
    <button class="romans-mini-next" type="button" aria-label="Next Romans Road step">›</button>
  `;

  const bibleCard = heroContent.querySelector('.bible-app-card');
  const heroLine = heroContent.querySelector(':scope > p');
  heroContent.insertBefore(card, bibleCard || heroLine || null);

  const progress = card.querySelector('#romansMiniProgress');
  const title = card.querySelector('#romansMiniTitle');
  const text = card.querySelector('#romansMiniText');
  const next = card.querySelector('.romans-mini-next');
  let index = 0;

  const render = () => {
    const frame = frames[index];
    card.classList.add('is-changing');
    window.setTimeout(() => {
      progress.textContent = frame.progress;
      title.textContent = frame.title;
      text.textContent = frame.text;
      next.textContent = index === frames.length - 1 ? '↺' : '›';
      next.setAttribute('aria-label', index === frames.length - 1 ? 'Start Romans Road over' : 'Next Romans Road step');
      card.classList.remove('is-changing');
    }, 90);
  };

  next.addEventListener('click', () => {
    index = (index + 1) % frames.length;
    render();
  });
})();
