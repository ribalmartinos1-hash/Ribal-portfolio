/* ═══════════════════════════════════════════════
   RIBAL MARTINOS — scroll-driven cinematic engine
   GSAP + ScrollTrigger · canvas frame scrubbing
   ═══════════════════════════════════════════════ */

/* if the animation library somehow failed to load, never leave a black screen:
   show everything unanimated and bail out of the cinematic engine */
const HAS_GSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
if (!HAS_GSAP) {
  document.body.classList.add("no-anim");
  const pl = document.getElementById("preloader");
  if (pl) pl.classList.add("is-done");
} else {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── config ─────────────────────────────── */
const FRAME_COUNT = 192;
const FRAME_PATH = i => `assets/frames/frame_${String(i + 1).padStart(3, "0")}.webp`;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── canvas setup ───────────────────────── */
const canvas = document.getElementById("seqCanvas");
const ctx = canvas.getContext("2d");
const images = new Array(FRAME_COUNT);
const seq = { frame: 0 };
let loaded = 0;

function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  render();
}

/* camera drift applied after the disassembly (keeps the ending alive) */
const drift = { zoom: 1, x: 0, y: 0, rot: 0 };

/* draw current frame, cover-fit + drift transform */
function render() {
  const img = images[Math.round(seq.frame)];
  if (!img || !img.complete || !img.naturalWidth) return;
  const cw = canvas.width, ch = canvas.height;
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * drift.zoom;
  const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
  ctx.clearRect(0, 0, cw, ch);
  ctx.save();
  ctx.translate(cw / 2 + drift.x * cw, ch / 2 + drift.y * ch);
  ctx.rotate(drift.rot);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

/* ── preloader ──────────────────────────── */
const preloader = document.getElementById("preloader");
const pctEl = document.getElementById("preloaderPct");
const fillEl = document.getElementById("preloaderFill");

function onImgLoad() {
  loaded++;
  const pct = Math.round((loaded / FRAME_COUNT) * 100);
  pctEl.textContent = pct + "%";
  fillEl.style.width = pct + "%";
  if (loaded === FRAME_COUNT) start();
}

for (let i = 0; i < FRAME_COUNT; i++) {
  const img = new Image();
  img.src = FRAME_PATH(i);
  img.onload = onImgLoad;
  img.onerror = onImgLoad; // never hang the preloader
  images[i] = img;
}

/* safety: if something stalls, start anyway after 8s */
setTimeout(() => { if (!started) start(); }, 8000);

/* ── boot ───────────────────────────────── */
let started = false;
function start() {
  if (started) return;
  started = true;

  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);
  preloader.classList.add("is-done");

  if (HAS_GSAP) {
    introAnimation();
    heroScrub();
    sectionReveals();
  } else {
    render(); // at least show the camera
  }
}

/* ── intro: name rises out of its mask ──── */
function introAnimation() {
  gsap.to(".hero__line > span", {
    y: 0,
    duration: 1.2,
    ease: "power4.out",
    stagger: 0.12,
    delay: 0.35
  });
  gsap.from(".hero__kicker, .hero__scrollhint", {
    opacity: 0,
    duration: 1.4,
    delay: 0.9
  });
}

/* ── the film: disassembly in the hero, drift behind About ─ */
function heroScrub() {
  // full 192-frame disassembly completes inside the pinned hero
  gsap.to(seq, {
    frame: FRAME_COUNT - 1,
    snap: "frame",
    ease: "none",
    onUpdate: render,
    scrollTrigger: {
      trigger: "#heroPin",
      start: "top top",
      end: "+=300%",          // 3 screens of pure visual disassembly
      scrub: reduceMotion ? false : 0.5,
      pin: true,
      anticipatePin: 1
    }
  });

  // the name fades away early, then the film plays clean — no words
  gsap.to("#act1", {
    opacity: 0,
    y: -80,
    ease: "none",
    scrollTrigger: {
      trigger: "#heroPin",
      start: "top top",
      end: "+=70%",
      scrub: true
    }
  });

  // behind About: the exploded camera keeps moving —
  // slow zoom, sideways pan and a gentle rotation, so it never freezes
  if (!reduceMotion) {
    gsap.to(drift, {
      zoom: 1.16,
      x: -0.07,
      y: 0.025,
      rot: -0.055,            // ≈ -3.2°
      ease: "none",
      onUpdate: render,
      scrollTrigger: {
        trigger: ".about",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        invalidateOnRefresh: true
      }
    });
  }
}

/* ── generic reveals ────────────────────── */
function sectionReveals() {
  gsap.utils.toArray(".reveal").forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    });
  });
}

/* ── custom cursor + magnetic hovers ────── */
const cursor = document.getElementById("cursor");
if (cursor && window.matchMedia("(hover: hover)").matches) {
  let cx = -100, cy = -100, tx = -100, ty = -100;
  window.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll("a, button, .card").forEach(el => {
    el.addEventListener("pointerenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("pointerleave", () => cursor.classList.remove("is-hover"));
  });
}

/* magnetic pull on tagged elements */
if (HAS_GSAP) document.querySelectorAll(".magnetic").forEach(el => {
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.25,
      y: (e.clientY - r.top - r.height / 2) * 0.25,
      duration: 0.4, ease: "power3.out"
    });
  });
  el.addEventListener("pointerleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  });
});

/* footer year */
document.getElementById("year").textContent = new Date().getFullYear();
