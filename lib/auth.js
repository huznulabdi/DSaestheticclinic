// Sesi admin: cookie bertanda tangan HMAC (tanpa database sesi).
const crypto = require('crypto');

const COOKIE = 'ds_admin';
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

const sign = (p) =>
  crypto.createHmac('sha256', process.env.SESSION_SECRET || '').update(p).digest('base64url');

function configured() {
  return Boolean(process.env.ADMIN_PASSWORD && (process.env.SESSION_SECRET || '').length >= 16);
}

function checkPassword(input) {
  const a = crypto.createHash('sha256').update(String(input ?? '')).digest();
  const b = crypto.createHash('sha256').update(String(process.env.ADMIN_PASSWORD || '')).digest();
  return crypto.timingSafeEqual(a, b);
}

function makeToken() {
  const p = String(Date.now() + TTL_MS);
  return p + '.' + sign(p);
}

function verifyToken(t) {
  if (!t || !configured()) return false;
  const [p, sig] = String(t).split('.');
  if (!p || !sig) return false;
  const good = sign(p);
  const a = Buffer.from(sig);
  const b = Buffer.from(good);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(p) > Date.now();
}

function cookies(req) {
  const out = {};
  String(req.headers.cookie || '')
    .split(';')
    .forEach((c) => {
      const i = c.indexOf('=');
      if (i > 0) out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim());
    });
  return out;
}

const isAdmin = (req) => verifyToken(cookies(req)[COOKIE]);

function setSession(res, token, maxAgeSec) {
  const secure = process.env.VERCEL ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}${secure}`
  );
}

// Tolak permintaan lintas-situs untuk operasi yang mengubah data
function sameOrigin(req) {
  const o = req.headers.origin;
  if (!o) return true;
  try {
    return new URL(o).host === req.headers.host;
  } catch {
    return false;
  }
}

const clientIp = (req) =>
  String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'x').split(',')[0].trim();

module.exports = { configured, checkPassword, makeToken, isAdmin, setSession, sameOrigin, clientIp, TTL_MS };
