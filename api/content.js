const auth = require('../lib/auth');
const store = require('../lib/store');
const { normalize, defaults } = require('../lib/content');

const MAX_BYTES = 200 * 1024;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (!auth.isAdmin(req)) return res.status(401).json({ error: 'Belum login' });

  if (req.method === 'GET') {
    const { content, error } = await store.getContent();
    return res.status(200).json({
      content: normalize(content),
      defaults,
      isDefault: !content,
      dbError: error || null,
    });
  }

  if (!auth.sameOrigin(req)) return res.status(403).json({ error: 'Permintaan ditolak' });

  try {
    if (req.method === 'PUT') {
      const body = req.body && req.body.content;
      if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Data tidak valid' });
      if (JSON.stringify(body).length > MAX_BYTES) return res.status(413).json({ error: 'Data terlalu besar' });
      const clean = normalize(body);
      await store.saveContent(clean);
      return res.status(200).json({ ok: true, content: clean });
    }

    if (req.method === 'DELETE') {
      await store.resetContent();
      return res.status(200).json({ ok: true });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Gagal menyimpan ke database: ' + e.message });
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  res.status(405).json({ error: 'Metode tidak didukung' });
};
