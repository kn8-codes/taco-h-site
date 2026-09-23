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

/* stop.json → TODAY'S STOP card + map */
async function loadStop() {
  try {
    var res = await fetch('./data/stop.json', { cache: 'no-store' });
    var data = await res.json();
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
  } catch (e) {
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
