// Pratinjau untuk panel admin: merender konten yang BELUM disimpan.
const auth = require('../lib/auth');
const { normalize } = require('../lib/content');
const { renderPage } = require('../lib/render');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!auth.isAdmin(req)) return res.status(401).send('Belum login');
  if (req.method !== 'POST') return res.status(405).send('Metode tidak didukung');
  if (!auth.sameOrigin(req)) return res.status(403).send('Permintaan ditolak');
  const body = req.body && req.body.content;
  if (!body || typeof body !== 'object') return res.status(400).send('Data tidak valid');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(renderPage(normalize(body), { preview: true }));
};
