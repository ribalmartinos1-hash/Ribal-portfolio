# Ribal Martinos — Portfolio

Cinematic scroll-driven portfolio. Dark, huge typography, and a hero where an
exploded-view camera disassembles as you scroll (192-frame canvas scrub, GSAP ScrollTrigger).
The film runs behind the whole opening — hero and About — and completes right before Selected Work.

## Run locally

Any static server works:

```bash
npx serve .
# or
python -m http.server 8000
```

Then open http://localhost:8000. (Opening index.html directly via file:// also works in most browsers.)

## Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/ribal-portfolio.git
git branch -M main
git push -u origin main
```

## Free hosting with GitHub Pages

1. Push (above)
2. Repo → Settings → Pages
3. Source: "Deploy from a branch" → branch `main`, folder `/ (root)` → Save
4. Live at `https://YOUR_USERNAME.github.io/ribal-portfolio/` in ~1 minute

## Add your real work

Open `index.html`, find the `▼▼ SWAP ZONE ▼▼` comment in the Selected Work section.
Replace each placeholder `.card__media` content with:

```html
<video muted loop playsinline preload="metadata" src="assets/work/yourclip.mp4"></video>
<!-- or -->
<img src="assets/work/yourphoto.jpg" alt="Project name">
```

Put the media files in `assets/work/`. Keep clips short (5–10 s, ~720p) so the page stays fast.

## Personalize

- **Instagram / WhatsApp**: in `index.html` contact section, replace `YOUR_HANDLE` and `YOUR_NUMBER` (international format, no `+`).
- **About principles**: edit the three `.principle` cards in `index.html` as your track record grows.
- **Accent color**: `--accent` in `css/style.css`.

## Client deliveries

Clients get their projects at `delivery.html?c=THEIR-CODE` — a branded page with a
button to their Google Photos album. To add a client, edit `js/clients.js`:

```js
"sara-june2026": {
  name: "Sara & Omar",
  project: "Wedding Film",
  album: "https://photos.app.goo.gl/xxxxxxxx"
}
```

Then send them `https://YOUR-DOMAIN/delivery.html?c=sara-june2026` on WhatsApp.
Codes should be lowercase with dashes. Note: album links are readable in the page
source, so rely on Google Photos' own unguessable links — don't put anything
truly private there.

## Structure

```
index.html          page
css/style.css       all styling
js/main.js          scroll engine (GSAP + canvas frame scrub)
assets/frames/      192 webp frames of the exploding camera
assets/work/        (create this) your real videos/photos
```
