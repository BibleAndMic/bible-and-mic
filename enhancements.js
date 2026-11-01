// B&M progressive enhancements — intentionally small and additive.
(() => {
  const bibleCard = document.querySelector('.bible-app-card');
  if (bibleCard) {
    bibleCard.id = 'bible';
    bibleCard.href = 'https://www.youversion.com/bible-app';
    bibleCard.target = '_blank';
    bibleCard.rel = 'noopener';
    bibleCard.setAttribute('aria-label', 'Open the free YouVersion Bible App page. B&M stays open.');
  }

  const bibleNav = document.querySelector('.nav-item[data-bible-nav]');
  bibleNav?.addEventListener('click', event => {
    const target = document.getElementById('bible');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
