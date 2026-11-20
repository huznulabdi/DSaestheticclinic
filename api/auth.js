const auth = require('../lib/auth');
const store = require('../lib/store');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    return res.status(200).json({ authenticated: auth.isAdmin(req), configured: auth.configured() });
  }

  if (!auth.sameOrigin(req)) return res.status(403).json({ error: 'Permintaan ditolak' });

  if (req.method === 'DELETE') {
    auth.setSession(res, '', 0);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'POST') {
    if (!auth.configured()) {
      return res.status(500).json({
        error: 'ADMIN_PASSWORD dan SESSION_SECRET (min. 16 karakter) belum diatur di Vercel',
      });
    }
    const ip = auth.clientIp(req);
    const lim = await store.hit('login:' + ip, 8, 15 * 60);
    if (!lim.ok) return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' });

    const password = req.body && req.body.password;
    if (!auth.checkPassword(password)) {
      return res.status(401).json({ error: 'Password salah' });
    }
    await store.clearHits('login:' + ip);
    auth.setSession(res, auth.makeToken(), Math.floor(auth.TTL_MS / 1000));
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  res.status(405).json({ error: 'Metode tidak didukung' });
};
