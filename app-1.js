// ============================================================
// B&M | BIBLE & MIC — EASY CONTENT CONFIG
// For most updates, change ONLY this section.
// ============================================================
const site = {
  featuredSong: {
    title: "He's Working on Me",
    artist: "B&M | Bible & Mic",
    audio: "featured-song.mp3"
  },

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

// ---------- Render content ----------
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

// ---------- Audio player ----------
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const seek = document.getElementById("seek");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const audioNote = document.getElementById("audioNote");
audio.src = site.featuredSong.audio;

const fmt = seconds => {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = fmt(audio.duration);
  audioNote.textContent = "Ready to play.";
  audioNote.classList.add("ready");
});
audio.addEventListener("error", () => {
  audioNote.innerHTML = 'Add your MP3 to <strong>assets/featured-song.mp3</strong> to activate the player.';
});
audio.addEventListener("timeupdate", () => {
  currentTime.textContent = fmt(audio.currentTime);
  if (audio.duration) seek.value = (audio.currentTime / audio.duration) * 100;
});
audio.addEventListener("ended", () => { playBtn.textContent = "▶"; });

playBtn.addEventListener("click", async () => {
  if (audio.paused) {
    try { await audio.play(); playBtn.textContent = "❚❚"; } catch (e) { audioNote.textContent = "Add the featured MP3 first, then the player will work."; }
  } else {
    audio.pause(); playBtn.textContent = "▶";
  }
});
seek.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (seek.value / 100) * audio.duration;
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
