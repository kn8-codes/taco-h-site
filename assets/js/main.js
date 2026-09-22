/* TACO H — skeleton v0 (2026-09-22 · Egon) */

/* EN/ES toggle */
function setLang(lang) {
  document.body.classList.toggle('en', lang === 'en');
  document.body.classList.toggle('es', lang === 'es');
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  try { localStorage.setItem('taco-lang', lang); } catch (e) {}
}

/* stop.json → TODAY'S STOP card + map */
async function loadStop() {
  try {
    var res = await fetch('./data/stop.json', { cache: 'no-store' });
    var data = await res.json();
    var box = document.getElementById('stop-card');
    if (box) {
      box.innerHTML =
        '<div class="stop-name">' + escapeHtml(data.location) + '</div>' +
        '<div class="stop-time">' + escapeHtml(data.schedule) + '</div>' +
        '<div>' + escapeHtml(data.note) + '</div>';
    }
    var map = document.getElementById('stop-map');
    if (map) {
      map.src = 'https://www.google.com/maps?q=' + encodeURIComponent(data.map_query) + '&output=embed';
    }
  } catch (e) {
    /* skeleton error tolerance — the static card text remains */
    console.warn('stop.json not loaded', e);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* init */
document.addEventListener('DOMContentLoaded', function () {
  var saved = 'en';
  try { saved = localStorage.getItem('taco-lang') || 'en'; } catch (e) {}
  setLang(saved);
  loadStop();
});