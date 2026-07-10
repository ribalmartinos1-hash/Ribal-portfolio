/* ═══ client delivery logic ═══ */
(function () {
  const ready = document.getElementById("deliveryReady");
  const ask = document.getElementById("deliveryAsk");
  const err = document.getElementById("codeError");

  const code = (new URLSearchParams(location.search).get("c") || "")
    .trim().toLowerCase();
  const client = code && typeof CLIENTS === "object" ? CLIENTS[code] : null;

  if (client) {
    document.getElementById("clientName").textContent = client.name;
    document.getElementById("clientProject").textContent =
      client.project ? " — " + client.project : "";
    document.getElementById("albumBtn").href = client.album;
    ready.hidden = false;
  } else {
    ask.hidden = false;
    if (code) err.hidden = false;   // a code was given but not found
  }

  document.getElementById("codeForm").addEventListener("submit", e => {
    e.preventDefault();
    const v = document.getElementById("codeInput").value.trim().toLowerCase();
    if (v) location.href = "delivery.html?c=" + encodeURIComponent(v);
  });

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
