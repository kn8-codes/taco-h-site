/* TACO H — skeleton + analytics hooks (2026-09-22 · Egon) */

/* EN/ES toggle */
function setLang(lang) {
  document.body.classList.toggle('en', lang === 'en');
  document.body.classList.toggle('es', lang === 'es');
  document.documentElement.lang = lang === 'es' ? 'es' : 'en';
  document.querySelectorAll('.lang button').forEach(function (b) {
    var on = b.dataset.lang === lang;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  try { localStorage.setItem('taco-lang', lang); } catch (e) {}
  try { window.__pg && __pg('capture', 'lang_toggled', { lang: lang }); } catch (e) {}
}

/* stop → TODAY'S STOP card + map. API-first (KV-backed when admin set it);
   falls back to the committed data/stop.json when the API is empty/unreachable. */
async function loadStop() {
  var data = null;
  try {
    var res = await fetch('./api/stop', { cache: 'no-store' });
    if (res.ok) data = await res.json();
  } catch (e) {}
  if (!data || !data.location) {
    try {
      var res2 = await fetch('./data/stop.json', { cache: 'no-store' });
      data = await res2.json();
    } catch (e2) {
      console.warn('stop not loaded', e2);
      return;
    }
  }
  var box = document.getElementById('stop-card');
  if (box) {
    box.innerHTML =
      '<div class="stop-name"><span data-lang="en">' + escapeHtml(data.location) + '</span><span data-lang="es">' + escapeHtml(data.location_es || data.location) + '</span></div>' +
      '<div class="stop-time"><span data-lang="en">' + escapeHtml(data.schedule) + '</span><span data-lang="es">' + escapeHtml(data.schedule_es || data.schedule) + '</span></div>' +
      '<div><span data-lang="en">' + escapeHtml(data.note) + '</span><span data-lang="es">' + escapeHtml(data.note_es || data.note) + '</span></div>';
  }
  var map = document.getElementById('stop-map');
  if (map) {
    map.src = 'https://www.google.com/maps?q=' + encodeURIComponent(data.map_query) + '&output=embed';
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
  /* analytics hooks — bounded taxonomy (ANALYTICS_SPEC) */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    try {
      if (!window.__pg) return;
      if (/^tel:/.test(href)) { __pg('capture', 'contact_tapped', { kind: 'phone' }); }
      else if (/^mailto:/.test(href)) { __pg('capture', 'contact_tapped', { kind: 'email' }); }
      else if (/^https?:/.test(href) && !/tacohakron\.com/.test(href)) {
        __pg('capture', 'social_outbound', { platform: a.className.indexOf('fb') > -1 ? 'facebook' : 'instagram' });
      }
    } catch (e) {}
  });
});
