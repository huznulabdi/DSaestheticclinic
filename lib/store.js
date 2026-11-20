// Penyimpanan konten di Upstash Redis (REST). Mendukung nama variabel dari
// integrasi Upstash langsung (UPSTASH_REDIS_REST_*) maupun dari Vercel Marketplace (KV_REST_API_*).
const { Redis } = require('@upstash/redis');

const KEY = 'ds:content';
const BACKUP = 'ds:content:backup';
let redis = null;

function client() {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

async function getContent() {
  const r = client();
  if (!r) return { content: null, error: 'Variabel lingkungan Upstash belum diatur' };
  try {
    return { content: (await r.get(KEY)) || null };
  } catch (e) {
    return { content: null, error: e.message };
  }
}

async function saveContent(obj) {
  const r = client();
  if (!r) throw new Error('Variabel lingkungan Upstash belum diatur');
  const prev = await r.get(KEY);
  if (prev) await r.set(BACKUP, prev);
  await r.set(KEY, obj);
}

async function resetContent() {
  const r = client();
  if (!r) throw new Error('Variabel lingkungan Upstash belum diatur');
  await r.del(KEY);
}

// Pembatas percobaan login: maks `limit` kali per `windowSec` per kunci
async function hit(key, limit, windowSec) {
  const r = client();
  if (!r) return { ok: true };
  try {
    const n = await r.incr('ds:rl:' + key);
    if (n === 1) await r.expire('ds:rl:' + key, windowSec);
    return { ok: n <= limit };
  } catch {
    return { ok: true };
  }
}

async function clearHits(key) {
  const r = client();
  if (r) { try { await r.del('ds:rl:' + key); } catch {} }
}

module.exports = { getContent, saveContent, resetContent, hit, clearHits };
