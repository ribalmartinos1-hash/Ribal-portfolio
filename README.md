# Ribal Martinos — Portfolio

Cinematic scroll-driven portfolio. Dark, huge typography, and a hero where an
exploded-view camera disassembles as you scroll (120-frame canvas scrub, GSAP ScrollTrigger).

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
- **Stats**: `data-count` values in the About section.
- **Accent color**: `--accent` in `css/style.css`.

## Structure

```
index.html          page
css/style.css       all styling
js/main.js          scroll engine (GSAP + canvas frame scrub)
assets/frames/      120 webp frames of the exploding camera
assets/work/        (create this) your real videos/photos
```
