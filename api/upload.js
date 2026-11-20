// Unggah foto ke Vercel Blob (khusus admin). Browser sudah mengecilkan foto (maks ±1000px, JPEG),
// jadi ukuran tetap di bawah batas 4,5 MB request body Vercel Functions.
const { put } = require('@vercel/blob');
const auth = require('../lib/auth');

const MAX_BYTES = 4 * 1024 * 1024;

function sniff(b) {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return ['jpg', 'image/jpeg'];
  if (b.length > 8 && b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return ['png', 'image/png'];
  if (b.length > 12 && b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP') return ['webp', 'image/webp'];
  return null;
}

async function readBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > MAX_BYTES + 1024) throw new Error('too-large');
    chunks.push(c);
  }
  return Buffer.concat(chunks);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!auth.isAdmin(req)) return res.status(401).json({ error: 'Belum login' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak didukung' });
  if (!auth.sameOrigin(req)) return res.status(403).json({ error: 'Permintaan ditolak' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'Vercel Blob belum terhubung ke project ini (BLOB_READ_WRITE_TOKEN tidak ada)' });
  }

  let buf;
  try { buf = await readBody(req); }
  catch { return res.status(413).json({ error: 'File terlalu besar (maks 4 MB)' }); }
  if (!buf || !buf.length) return res.status(400).json({ error: 'File kosong' });
  if (buf.length > MAX_BYTES) return res.status(413).json({ error: 'File terlalu besar (maks 4 MB)' });

  const type = sniff(buf);
  if (!type) return res.status(415).json({ error: 'Format harus JPG, PNG, atau WebP' });

  const raw = new URL(req.url, 'http://x').searchParams.get('name') || 'foto';
  const base = raw.replace(/\.[^.]*$/, '').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'foto';

  try {
    const blob = await put(`foto/${base}.${type[0]}`, buf, {
      access: 'public',
      addRandomSuffix: true,
      contentType: type[1],
    });
    return res.status(200).json({ url: blob.url });
  } catch (e) {
    return res.status(500).json({ error: 'Gagal mengunggah ke Blob: ' + e.message });
  }
};
