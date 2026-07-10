/* ═══ fullscreen menu — opens from the RM. logo (shared by all pages) ═══ */
(function () {
  const menu = document.getElementById("menu");
  const btn = document.getElementById("menuBtn");
  const close = document.getElementById("menuClose");
  if (!menu || !btn) return;

  function open() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function shut() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  btn.addEventListener("click", e => { e.preventDefault(); open(); });
  if (close) close.addEventListener("click", shut);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", shut));
  window.addEventListener("keydown", e => { if (e.key === "Escape") shut(); });
})();
