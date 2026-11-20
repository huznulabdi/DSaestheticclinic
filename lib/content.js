// Normalisasi & validasi konten. Bentuk data mengikuti defaults.js:
// kunci yang tidak dikenal dibuang, tipe dipaksa sesuai bentuk bawaan.
const defaults = require('./defaults');

const MAX_STR = 3000;
const MAX_ITEMS = 40;
const HEX = /^#[0-9a-f]{6}$/i;

function blankLike(tpl) {
  if (typeof tpl === 'boolean') return true; // mis. "show": item baru tampil
  if (typeof tpl === 'number') return 0;
  if (Array.isArray(tpl)) return [];
  if (tpl && typeof tpl === 'object') {
    const o = {};
    for (const k of Object.keys(tpl)) o[k] = blankLike(tpl[k]);
    return o;
  }
  return '';
}

// fill(missing) -> nilai pengganti bila kunci tidak ada
function clean(input, tpl, path, inArray) {
  if (Array.isArray(tpl)) {
    const item = tpl[0];
    if (!Array.isArray(input)) return inArray ? [] : tpl.map((x) => clean(undefined, x, path, false));
    return input.slice(0, MAX_ITEMS).map((x) => clean(x, item, path, true));
  }
  if (tpl && typeof tpl === 'object') {
    const src = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    const out = {};
    for (const k of Object.keys(tpl)) {
      const has = Object.prototype.hasOwnProperty.call(src, k);
      if (!has) {
        out[k] = inArray ? blankLike(tpl[k]) : clean(undefined, tpl[k], path + '.' + k, false);
      } else {
        out[k] = clean(src[k], tpl[k], path + '.' + k, inArray);
      }
    }
    return out;
  }
  if (typeof tpl === 'boolean') {
    return input === undefined ? (inArray ? true : tpl) : input === true || input === 'true';
  }
  if (typeof tpl === 'number') {
    const n = Number(input);
    return Number.isFinite(n) ? n : tpl;
  }
  // string
  if (input === undefined || input === null) return inArray ? '' : tpl;
  let s = String(input).replace(/\r\n/g, '\n').slice(0, MAX_STR);
  if (path.startsWith('.theme.')) return HEX.test(s) ? s : tpl;
  if (path === '.site.whatsapp') s = s.replace(/\D/g, '') || tpl;
  if (path === '.site.phone') s = s.replace(/[^\d+]/g, '') || tpl;
  return s;
}

function normalize(input) {
  return clean(input, defaults, '', false);
}

module.exports = { normalize, defaults };
