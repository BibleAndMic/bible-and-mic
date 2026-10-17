# B&M | Bible & Mic — Version 1

A free, mobile-first static website designed to feel like an iPhone app and deploy on GitHub Pages.

## What is included
- Home / hero section
- Featured song
- Custom music player
- Lyrics
- Story / testimony
- Updates
- Fixed bottom navigation
- Web app manifest + service worker for Home Screen / app-like behavior

## Easiest content updates
Open `app.js` and edit the `site` object at the top. This controls:
- Featured song title
- Artist name
- Audio filename
- Lyrics
- Story paragraphs
- Updates

## Add your featured song
Put your MP3 at:
`assets/featured-song.mp3`

Or change the `audio` value in `app.js` to another filename.

## Publish with GitHub Pages
1. Create a public GitHub repository (for example `bible-and-mic`).
2. Add these files to the repository's default branch.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the default branch (usually `main`) and `/ (root)`, then Save.

The live project-site URL will normally be:
`https://YOUR-USERNAME.github.io/REPOSITORY/`

## Install on iPhone
Open the live site in Safari → Share → Add to Home Screen → turn on **Open as Web App** → Add.
