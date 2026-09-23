/* TACO H — stop single-source API (admin panel backend)
 * GET  /api/stop  -> KV stop when configured+set, else static data/stop.json (fallback).
 * POST /api/stop  -> passphrase-protected KV write (phone-first daily stop update).
 *
 * Zero-dependency: speaks Upstash REST via fetch + Vercel KV env vars, no npm packages,
 * no build step. Secret handling: passphrase compared constant-time; never logged.
 *
 * Env (Vercel project env — human-set, never in repo):
 *   KV_REST_API_URL / KV_REST_API_TOKEN  (auto-set when the KV store is linked)
 *   ADMIN_PASSPHRASE                     (the /admin login secret)
 */
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { timingSafeEqual } = require('node:crypto');

const KV_KEY = 'stop';
// Fields the admin may write. Regex/keys are closed — no arbitrary keys into KV.
const ALLOWED = ['location', 'location_es', 'map_query', 'schedule', 'schedule_es', 'note', 'note_es'];
const MAXLEN = 240;
const REQUIRED = ['location', 'schedule'];

function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (status === 200) res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

function readStaticStop() {
  const candidates = [
    join(process.cwd(), 'data', 'stop.json'),
    join(__dirname, '..', 'data', 'stop.json'),
    join(__dirname, 'data', 'stop.json'),
  ];
  for (const p of candidates) {
    try {
      if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf8'));
    } catch (_) {}
  }
  return {};
}

function kvEnv() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function kvGet() {
  const kv = kvEnv();
  if (!kv) return null;
  try {
    const r = await fetch(`${kv.url}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${kv.token}` },
    });
    if (!r.ok) return null;
    const j = await r.json();
    if (!j || j.result === null || j.result === undefined) return null;
    const parsed = JSON.parse(j.result);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_) {
    return null;
  }
}

async function kvSet(value) {
  const kv = kvEnv();
  if (!kv) return { ok: false, reason: 'kv_unconfigured' };
  try {
    const r = await fetch(`${kv.url}/set/${KV_KEY}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kv.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(value), // Upstash REST stores the raw body as the value
    });
    if (!r.ok) return { ok: false, reason: `kv_http_${r.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: 'kv_network' };
  }
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function cleanStop(body) {
  const stop = body && typeof body.stop === 'object' ? body.stop : {};
  const clean = {};
  const missing = [];
  for (const k of ALLOWED) {
    if (stop[k] === undefined || stop[k] === null) {
      if (REQUIRED.includes(k)) missing.push(k);
      continue;
    }
    if (typeof stop[k] !== 'string') return { error: `type_${k}` };
    const v = stop[k].trim();
    if (v.length > MAXLEN) return { error: `long_${k}` };
    if (v) clean[k] = v;
  }
  if (missing.length) return { missing };
  if (!clean.location || !clean.schedule)
    return { missing: REQUIRED.filter((k) => !clean[k]) };
  return { clean };
}

async function handleGet(req, res) {
  const kv = await kvGet();
  let data = kv && kv.location ? kv : readStaticStop();
  if (!data || typeof data !== 'object') data = {};
  if (!data.map_query) data.map_query = data.location || '';
  json(res, 200, data);
}

async function handlePost(req, res) {
  let body = {};
  try {
    const text = await new Promise((resolve, reject) => {
      let acc = '';
      req.setEncoding('utf8');
      req.on('data', (c) => { acc += c; if (acc.length > 16384) { reject(new Error('too_large')); req.destroy(); } });
      req.on('end', () => resolve(acc));
      req.on('error', reject);
    });
    body = JSON.parse(text);
  } catch (_) {
    return json(res, 400, { error: 'bad_json' });
  }

  const pass = process.env.ADMIN_PASSPHRASE || '';
  const sent = typeof body.passphrase === 'string' ? body.passphrase : '';
  if (!pass || !safeEqual(sent, pass)) return json(res, 401, { error: 'unauthorized' });

  const result = cleanStop(body);
  if (result.error) return json(res, 400, { error: result.error });
  if (result.missing) return json(res, 400, { error: 'missing', missing: result.missing });

  const kv = await kvSet(result.clean);
  if (!kv.ok) return json(res, 500, { error: kv.reason });

  json(res, 200, { ok: true, stop: result.clean, saved_at: new Date().toISOString() });
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'POST') return handlePost(req, res);
  json(res, 405, { error: 'method_not_allowed' });
};