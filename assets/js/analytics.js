/* TACO H — PostHog analytics loader (2026-09-22 · Egon)
   Data plan: ANALYTICS_SPEC_2026-09-22.md
   - pageviews/autocapture + session replay ON (Nate lifted the no-capture boundary 09-22)
   - mask all inputs (checkout-hygiene floor: no typed text captured, incl. future order fields)
   - never sell/export: Nate's one absolute line
   Project key phc_* is public-by-design (ships in the page source on purpose). */
(function (c, h, i, n) {
  c[i] = c[i] || function () { (c[i].q = c[i].q || []).push(arguments); };
  c[i].i = +new Date();
  c[i].onload = function () {
    var s = document.createElement('script');
    s.src = 'https://us-assets.i.posthog.com/array.js';
    s.async = true;
    document.head.appendChild(s);
  };
  c[i]('init', h, n);
})(window, 'phc_kyEumGJxLesMDqgh2qN5nuhHP8xVtzecNDynhkc2giQd', '__pg', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',   /* anonymous behavior stays aggregate; no automatic person dossiers */
  session_recording: { maskAllInputs: true }, /* replay on, but inputs masked (card-data hygiene) */
  persistence: 'localStorage+cookie',   /* profile continuity on the device only */
  capture_pageview: true,
  autocapture: true
});