export const tracks = [
  {
    id: 'stars-in-the-sky',
    title: 'Stars In The Sky',
    producer: 'WsW Makk',
    audio: 'stars-in-the-sky.mp3',
    cover: 'stars-in-the-sky-cover.jpg',
    monogram: 'SITS',
    releaseDate: '',
    behind: '',
    lyrics: '',
    verseReference: ''
  },
  {
    id: 'hes-working-on-me',
    title: 'He’s Working on Me',
    producer: 'Syndrome',
    audio: 'featured-song.mp3',
    cover: '',
    monogram: 'HWM',
    releaseDate: '',
    behind: '',
    lyrics: '',
    verseReference: ''
  },
  {
    id: 'good2me',
    title: 'Good2Me',
    producer: 'Jake Angel',
    audio: 'good2me.mp3',
    cover: '',
    monogram: 'G2M',
    releaseDate: '',
    behind: '',
    lyrics: '',
    verseReference: ''
  },
  {
    id: 'crazy-4-christ',
    title: 'Crazy 4 Christ',
    producer: 'Morgan',
    audio: 'crazy-4-christ.mp3',
    cover: '',
    monogram: 'C4C',
    releaseDate: '',
    behind: '',
    lyrics: '',
    verseReference: ''
  }
];

// Optional song context is intentionally invisible until Corey supplies it.
setTimeout(() => {
  document.getElementById('lyrics')?.remove();

  tracks.forEach((track, index) => {
    const card = index === 0
      ? document.querySelector('.feature-track')
      : document.querySelector(`[data-track-id="${track.id}"]`);
    if (!card) return;

    const copy = card.querySelector(index === 0 ? '.feature-copy' : '.small-copy');
    if (!copy) return;

    if (track.behind?.trim()) {
      const behind = document.createElement('p');
      behind.className = 'behind-track';
      behind.textContent = track.behind.trim();
      copy.appendChild(behind);
    }

    if (track.lyrics?.trim()) {
      const panel = document.createElement('details');
      panel.className = 'lyrics-panel';
      const reference = track.verseReference?.trim()
        ? `<div class="lyrics-reference">${track.verseReference.trim()}</div>`
        : '';
      panel.innerHTML = `<summary>Lyrics</summary>${reference}<div class="lyrics-text"></div>`;
      panel.querySelector('.lyrics-text').textContent = track.lyrics.trim();
      copy.appendChild(panel);
    }
  });

  import('./community.js').catch(() => {});
}, 0);
