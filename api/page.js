// Halaman publik: dirender di server dari data Upstash (baik untuk SEO, tanpa kedipan).
const { getContent } = require('../lib/store');
const { normalize } = require('../lib/content');
const { renderPage } = require('../lib/render');

module.exports = async (req, res) => {
  const { content } = await getContent(); // bila gagal, jatuh ke konten bawaan
  const html = renderPage(normalize(content));
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=60');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(200).send(html);
};
