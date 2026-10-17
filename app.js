// ============================================================
// B&M | BIBLE & MIC — EASY CONTENT CONFIG
// ============================================================
const site = {
  featuredSong: {
    title: "He's Working on Me",
    artist: "B&M | Bible & Mic",
    audio: "featured-song.mp3"
  },

  moreSongs: [
    {
      title: "Good2Me",
      artist: "B&M | Bible & Mic",
      audio: "good2me.mp3",
      mark: "G2M",
      tag: "RELEASE"
    },
    {
      title: "Crazy 4 Christ",
      artist: "B&M | Bible & Mic",
      audio: "crazy-4-christ.mp3",
      mark: "C4C",
      tag: "NEW"
    }
  ],

  lyrics: `COMING SOON\n\nLyrics and the story behind the music are on the way.`,

  story: [
    "Christ changed everything. I was lost thinking I was found, living life my way while calling it faith. Jesus met me in the mess, gave me a new direction, a new purpose, and showed me what a real relationship with Him looks like.",
    "I’m still a work in progress. Just a dude from Minnesota with a Bible and a mic, pointing people to the One who changed my life."
  ],

  updates: [
    {
      date: "OCT 2026",
      title: "Crazy 4 Christ — out now.",
      text: "My newest release is live. Faith over fear, all glory to God."
    },
    {
      date: "SEP 2026",
      title: "He’s Working on Me — released.",
      text: "A reminder that God is still shaping, rebuilding, and working on me every day."
    }
  ]
};

// ---------- Helpers ----------
const fmt = seconds => {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const allPlayers = [];
function stopOtherPlayers(currentAudio) {
  allPlayers.forEach(({ audio, button, card }) => {
    if (audio !== currentAudio && !audio.paused) {
      audio.pause();
      button.textContent = "▶";
      card.classList.remove("is-playing");
    }
  });
}

function wirePlayer({ audio, button, seek, current, duration, card, note }) {
  const player = { audio, button, seek, current, duration, card };
  allPlayers.push(player);

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = fmt(audio.duration);
    if (note) {
      note.textContent = "Ready to play.";
      note.classList.add("ready");
    }
  });

  audio.addEventListener("timeupdate", () => {
    current.textContent = fmt(audio.currentTime);
    if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
  });

  audio.addEventListener("ended", () => {
    button.textContent = "▶";
    card.classList.remove("is-playing");
    seek.value = 0;
    current.textContent = "0:00";
  });

  audio.addEventListener("error", () => {
    if (note) note.textContent = "Audio file not found yet.";
  });

  button.addEventListener("click", async () => {
    if (audio.paused) {
      stopOtherPlayers(audio);
      try {
        await audio.play();
        button.textContent = "❚❚";
        card.classList.add("is-playing");
      } catch (e) {
        if (note) note.textContent = "Tap again after the song finishes loading.";
      }
    } else {
      audio.pause();
      button.textContent = "▶";
      card.classList.remove("is-playing");
    }
  });

  seek.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
  });
}

// ---------- Render main content ----------
document.getElementById("songTitle").textContent = site.featuredSong.title;
document.getElementById("songArtist").textContent = site.featuredSong.artist;
document.getElementById("coverTitle").textContent = site.featuredSong.title.toUpperCase();

const lyricsEl = document.getElementById("lyricsBody");
lyricsEl.textContent = site.lyrics;
if (site.lyrics.startsWith("COMING SOON")) lyricsEl.classList.add("placeholder");

const storyEl = document.getElementById("storyBody");
site.story.forEach(text => {
  const p = document.createElement("p");
  p.textContent = text;
  storyEl.appendChild(p);
});

const updatesEl = document.getElementById("updatesList");
site.updates.forEach(item => {
  const card = document.createElement("article");
  card.className = "update-card";
  const time = document.createElement("time");
  time.textContent = item.date;
  const h3 = document.createElement("h3");
  h3.textContent = item.title;
  const p = document.createElement("p");
  p.textContent = item.text;
  card.append(time, h3, p);
  updatesEl.appendChild(card);
});

// ---------- Featured player ----------
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const seek = document.getElementById("seek");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const audioNote = document.getElementById("audioNote");
const featuredCard = document.querySelector(".player-card");
audio.src = site.featuredSong.audio;

// Add a subtle animated equalizer to the featured player.
const featuredEq = document.createElement("div");
featuredEq.className = "mini-eq";
featuredEq.setAttribute("aria-hidden", "true");
featuredEq.innerHTML = "<i></i><i></i><i></i><i></i><i></i><i></i>";
featuredCard.prepend(featuredEq);

wirePlayer({
  audio,
  button: playBtn,
  seek,
  current: currentTime,
  duration,
  card: featuredCard,
  note: audioNote
});

// ---------- More music ----------
const featuredSection = document.getElementById("featured");
const moreWrap = document.createElement("div");
moreWrap.className = "more-music";
moreWrap.innerHTML = `
  <div class="more-music-head">
    <span class="section-kicker">MORE MUSIC</span>
    <span class="library-count">${site.moreSongs.length + 1} TRACKS</span>
  </div>
  <div class="track-stack" id="trackStack"></div>
`;
featuredSection.appendChild(moreWrap);
const trackStack = moreWrap.querySelector("#trackStack");

site.moreSongs.forEach((song, index) => {
  const card = document.createElement("article");
  card.className = "music-card";
  card.innerHTML = `
    <div class="music-mark" aria-hidden="true">
      <span>${song.mark}</span>
      <b></b><b></b><b></b><b></b>
    </div>
    <div class="music-info">
      <div class="music-title-row">
        <div>
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>
        <span class="music-tag">${song.tag}</span>
      </div>
      <audio preload="metadata" src="${song.audio}"></audio>
      <div class="music-controls">
        <button class="music-play" aria-label="Play ${song.title}">▶</button>
        <div class="music-timeline">
          <div class="time-row"><span class="music-current">0:00</span><span class="music-duration">0:00</span></div>
          <input class="seek music-seek" type="range" min="0" max="100" value="0" aria-label="Seek through ${song.title}">
        </div>
      </div>
      <div class="music-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    </div>
  `;
  trackStack.appendChild(card);

  wirePlayer({
    audio: card.querySelector("audio"),
    button: card.querySelector(".music-play"),
    seek: card.querySelector(".music-seek"),
    current: card.querySelector(".music-current"),
    duration: card.querySelector(".music-duration"),
    card
  });
});

// ---------- Bottom-nav active state ----------
const sections = [...document.querySelectorAll(".page-section")];
const navItems = [...document.querySelectorAll(".nav-item")];
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navItems.forEach(n => n.classList.toggle("active", n.dataset.target === visible.target.id));
}, { rootMargin: "-30% 0px -55% 0px", threshold: [0,.2,.6] });
sections.forEach(s => observer.observe(s));

// ---------- PWA / offline shell ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
