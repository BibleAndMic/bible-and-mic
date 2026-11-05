# B&M | Bible & Mic

Mobile-first Christian hip-hop / testimony site published with GitHub Pages and designed to feel app-like on iPhone.

## Current core files
- `index.html` — page structure and content
- `styles.css` — stylesheet entry point
- `base-styles.css` — main site styling
- `hero-polish.css` — current homepage/hero overrides
- `app.js` — active JavaScript, music player, Daily Walk stories, navigation, and PWA behavior
- `sw.js` — service worker / offline cache
- `manifest.webmanifest` — installable web-app settings

## Important editing rule
Before changing or removing a file, verify that it is referenced by `index.html`, CSS, JavaScript, the manifest, or the service worker. Avoid creating numbered duplicate files such as `app-1.js` or `styles-2.css` for normal updates.

## Homepage image
The current homepage still uses the sliced hero system in `hero-polish.css`. The cleanup goal is to replace that with one dependable hero asset so future background swaps are simple and predictable.

## Media
The repository currently stores images, video, and MP3 files alongside the site files. A future cleanup can move these into clear media folders after all references are updated together.

## Publishing
The live site is served from the `main` branch through GitHub Pages.

## Safe cleanup branches
- `backup-before-cleanup-2026-10-26` — protected snapshot before cleanup work
- `cleanup-site-structure` — cleanup work in progress; changes here do not affect the live site until merged

## Working principle
Keep the live design stable while simplifying the code underneath it. Make one controlled change at a time, verify mobile behavior, and only then publish it to `main`.
