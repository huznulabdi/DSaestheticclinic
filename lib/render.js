// Merender halaman publik dari objek konten. Semua teks di-escape; hanya
// *kata* (miring) dan baris baru yang diubah menjadi markup.

const WA_SVG =
  '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

// Di dalam iframe pratinjau, tautan #anchor hanya menggulir, tidak berpindah halaman
const PREVIEW_JS = `<script>document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.getAttribute('href')||'';if(h.charAt(0)==='#'){e.preventDefault();var t=h.length>1&&document.querySelector(h);if(t)t.scrollIntoView({behavior:'smooth'});else window.scrollTo({top:0,behavior:'smooth'});}});</script>`;

// ── Helpers ─────────────────────────────────────────────
const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Teks dengan *miring* dan baris baru
const rich = (v) =>
  esc(v)
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/\r?\n/g, '<br/>');

const lines = (v) =>
  String(v ?? '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

const safeUrl = (u) => {
  const s = String(u ?? '').trim();
  return /^(https?:\/\/|\/|#|tel:|mailto:)/i.test(s) ? s : '#';
};

const safeImg = (u) => {
  const s = String(u ?? '').trim();
  return /^https:\/\//i.test(s) || /^\/[^/]/.test(s) ? s : '';
};

const digits = (v) => String(v ?? '').replace(/\D/g, '');
const waLink = (num, text) =>
  `https://wa.me/${digits(num)}` + (text ? `?text=${encodeURIComponent(text)}` : '');

const hex = (v, fallback) => (/^#[0-9a-f]{6}$/i.test(String(v)) ? v : fallback);
const rgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

const delay = (i, step) => (i ? ` style="transition-delay:${(i * step).toFixed(2)}s"` : '');
const arr = (v) => (Array.isArray(v) ? v : []);

// ── Bagian halaman ──────────────────────────────────────
function header(s, label, title, ornamentStyle = '') {
  return `<div class="sec-header reveal">
    <div class="ornament"><span${ornamentStyle}>✦</span></div>
    <span class="section-label">${esc(label)}</span>
    <h2 class="section-title">${rich(title)}</h2>
  </div>`;
}

function renderPage(c, opts = {}) {
  const wa = c.site.whatsapp;
  const show = (id) => c.layout.show[id] !== false;
  const logo = `${esc(c.site.name1)} <span>${esc(c.site.name2)}</span> ${esc(c.site.name3)}`;
  const t = c.theme;

  const themeCss = `:root{
  --gold:${hex(t.gold, '#C9973E')};
  --gold-deep:${hex(t.goldDeep, '#9C7430')};
  --gold-bright:${hex(t.goldBright, '#E8A840')};
  --gold-light:${hex(t.goldLight, '#E8CFA0')};
  --gold-pale:${hex(t.goldPale, '#F8F0E0')};
  --cream:${hex(t.cream, '#FDFAF4')};
  --ivory:${hex(t.ivory, '#F5EED8')};
  --charcoal:${hex(t.charcoal, '#1C1A16')};
  --warm-mid:${hex(t.warmMid, '#6B5F4A')};
  --gold-rgb:${rgb(hex(t.gold, '#C9973E'))};
  --gold-deep-rgb:${rgb(hex(t.goldDeep, '#9C7430'))};
  --cream-rgb:${rgb(hex(t.cream, '#FDFAF4'))};
}`;

  // NAV
  const nav = `<nav id="navbar">
  <a href="#" class="nav-logo">${logo}</a>
  <ul class="nav-links">
${arr(c.nav.links)
  .map((l) => `    <li><a href="${esc(safeUrl(l.target))}">${esc(l.label)}</a></li>`)
  .join('\n')}
  </ul>
  <a href="${esc(waLink(wa, c.nav.ctaWaText))}" class="btn-gold nav-cta" target="_blank" rel="noopener">${esc(c.nav.ctaLabel)}</a>
</nav>`;

  // HERO
  const h = c.hero;
  const hero = `<section id="hero">
  <div class="hero-inner-ring"></div>
  <div class="hcard hcard-left">
    <div class="hcard-lbl">${esc(h.statLeftLabel)}</div>
    <div class="hcard-val">${esc(h.statLeftValue)}</div>
  </div>
  <div class="hcard hcard-right">
    <div class="hcard-lbl">${esc(h.statRightLabel)}</div>
    <div class="hcard-val">${esc(h.statRightValue)}</div>
  </div>
  <div class="hero-badge">${esc(h.badge)}</div>
  <div class="hero-promo-tag">${esc(h.promoTag)}</div>
  <h1 class="hero-title">${rich(h.title)}</h1>
  <p class="hero-sub">${esc(h.sub)}</p>
  <div class="hero-promo-bar">
${arr(h.pills)
  .map(
    (p) => `    <div class="promo-pill">
      <strong>${esc(p.big)}</strong>
      <span>${esc(p.small)}</span>
    </div>`
  )
  .join('\n')}
  </div>
  <div class="hero-cta">
    <a href="${esc(waLink(wa, h.ctaWaText))}" class="btn-wa" target="_blank" rel="noopener">${WA_SVG}${esc(h.ctaLabel)}</a>
    <a href="${esc(safeUrl(h.ctaSecondaryTarget))}" class="btn-outline">${esc(h.ctaSecondaryLabel)}</a>
  </div>
</section>`;

  // TRUST
  const trust = `<div id="trust">
${arr(c.trust.items)
  .map(
    (i) => `  <div class="trust-item">
    <div class="trust-ico">${esc(i.icon)}</div>
    <div><strong>${esc(i.title)}</strong><small>${esc(i.sub)}</small></div>
  </div>`
  )
  .join('\n')}
</div>`;

  // PROMOS
  const p = c.promos;
  const promos = `<section id="promos">
  ${header(c, p.label, p.title)}
  <div class="promo-grid">
${arr(p.items)
  .filter((i) => i.show !== false)
  .map(
    (i, n) => `    <div class="promo-card reveal"${delay(n, 0.08)}>
      <span class="promo-badge">${esc(i.badge)}</span>
      <h3>${esc(i.name)}</h3>
      <p>${esc(i.desc)}</p>
      <div class="promo-price">
        <span class="now">${esc(i.price)}</span>
        <span class="was">${esc(i.oldPrice)}</span>
        <span class="disc">${esc(i.discount)}</span>
      </div>
      <a href="${esc(waLink(wa, i.waText))}" class="btn-gold" target="_blank" rel="noopener">${esc(p.btnLabel)}</a>
    </div>`
  )
  .join('\n')}
  </div>
</section>`;

  // SERVICES
  const sv = c.services;
  const services = `<section id="services">
  ${header(c, sv.label, sv.title)}
  <div class="svc-grid">
${arr(sv.items)
  .map(
    (i, n) =>
      `    <div class="svc-card reveal"${delay(n, 0.06)}><span class="svc-icon">${esc(i.icon)}</span><h4>${esc(i.name)}</h4><p>${esc(i.desc)}</p></div>`
  )
  .join('\n')}
  </div>
  <div style="text-align:center;margin-top:14px" class="reveal">
    <a href="${esc(waLink(wa, sv.btnWaText))}" class="btn-outline" target="_blank" rel="noopener">${esc(sv.btnLabel)}</a>
  </div>
</section>`;

  // CERTIFICATIONS
  const ce = c.certifications;
  const certifications = `<section id="certifications">
  ${header(c, ce.label, ce.title)}
  <div class="cert-grid">
${arr(ce.items)
  .map(
    (i, n) => `    <div class="cert-card reveal"${delay(n, 0.08)}>
      <div class="cert-num">${String(n + 1).padStart(2, '0')}</div>
      <h4>${esc(i.title)}</h4>
      <p>${esc(i.desc)}</p>
    </div>`
  )
  .join('\n')}
  </div>
</section>`;

  // DOCTORS
  const d = c.doctors;
  const doctors = `<section id="doctors">
  ${header(c, d.label, d.title)}
  <div class="doc-grid">
${arr(d.items)
  .map((i, n) => {
    const img = safeImg(i.photo);
    const avatar = img
      ? `<div class="doc-avatar has-photo"><img src="${esc(img)}" alt="${esc(i.name)}" loading="lazy"/></div>`
      : `<div class="doc-avatar"><span class="doc-avi-icon">${esc(i.icon)}</span></div>`;
    const tags = String(i.tags ?? '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => `<span>${esc(x)}</span>`)
      .join('');
    return `    <div class="doc-card reveal"${delay(n, 0.1)}>
      ${avatar}
      <div class="doc-info">
        <h4>${esc(i.name)}</h4>
        <div class="doc-spec">${esc(i.spec)}</div>
        <div class="doc-tags">${tags}</div>
        <p>${esc(i.desc)}</p>
      </div>
    </div>`;
  })
  .join('\n')}
  </div>
</section>`;

  // HOW
  const hw = c.how;
  const how = `<section id="how">
  ${header(c, hw.label, hw.title)}
  <div class="steps reveal">
${arr(hw.steps)
  .map(
    (s, n) => `    <div class="step">
      <div class="step-num">${n + 1}</div>
      <h4>${esc(s.title)}</h4>
      <p>${esc(s.desc)}</p>
    </div>`
  )
  .join('\n')}
  </div>
  <div style="text-align:center;margin-top:52px" class="reveal">
    <a href="${esc(waLink(wa, hw.btnWaText))}" class="btn-wa" target="_blank" rel="noopener">${WA_SVG}${esc(hw.btnLabel)}</a>
  </div>
</section>`;

  // TESTIMONIALS
  const te = c.testimonials;
  const testimonials = `<section id="testimonials">
  ${header(c, te.label, te.title)}
  <div class="testi-grid">
${arr(te.items)
  .map((i, n) => {
    const stars = Math.min(5, Math.max(1, parseInt(i.stars, 10) || 5));
    return `    <div class="testi-card reveal"${delay(n, 0.08)}>
      <div class="testi-stars">${'★'.repeat(stars)}</div>
      <div class="testi-q">"</div>
      <p>${esc(i.text)}</p>
      <div class="testi-author">
        <div class="testi-avi">${esc(i.avatar)}</div>
        <div><strong>${esc(i.name)}</strong><span>${esc(i.detail)}</span></div>
      </div>
    </div>`;
  })
  .join('\n')}
  </div>
</section>`;

  // ARTICLES
  const a = c.articles;
  const articles = `<section id="articles">
  ${header(c, a.label, a.title)}
  <div class="art-grid">
${arr(a.items)
  .map(
    (i, n) => `    <div class="art-card reveal"${delay(n, 0.1)}>
      <div class="art-thumb art-t${(n % 3) + 1}">${esc(i.icon)}</div>
      <div class="art-body">
        <span class="art-tag">${esc(i.tag)}</span>
        <h4>${esc(i.title)}</h4>
        <p>${esc(i.desc)}</p>
        <div class="art-meta">
          <span>${esc(i.date)}</span>
          <a href="${esc(waLink(wa, i.waText))}" target="_blank" rel="noopener">${esc(a.linkLabel)}</a>
        </div>
      </div>
    </div>`
  )
  .join('\n')}
  </div>
  <div style="text-align:center" class="reveal">
    <a href="${esc(waLink(wa, a.btnWaText))}" class="btn-outline" target="_blank" rel="noopener">${esc(a.btnLabel)}</a>
  </div>
</section>`;

  // CTA
  const ct = c.cta;
  const cta = `<section id="cta">
  <div class="ornament reveal"><span style="color:rgba(232,207,160,.7)">✦</span></div>
  <span class="section-label reveal">${esc(ct.label)}</span>
  <h2 class="section-title reveal">${rich(ct.title)}</h2>
  <p class="reveal">${esc(ct.desc)}</p>
  <div class="cta-btns reveal">
    <a href="${esc(waLink(wa, ct.waText))}" class="btn-wa" target="_blank" rel="noopener">${WA_SVG}${esc(ct.waLabel)}</a>
    <a href="tel:${esc(phoneIntl(c.site.phone))}" class="btn-gold">${esc(ct.callLabel)}</a>
  </div>
</section>`;

  // INFO
  const inf = c.info;
  const info = `<section id="info">
  ${header(c, inf.label, inf.title)}
  <div class="info-grid">
${arr(inf.cards)
  .map((i, n) => {
    const body =
      i.format === 'list'
        ? `<ul>\n${lines(i.text)
            .map((l) => `        <li>${esc(l)}</li>`)
            .join('\n')}\n      </ul>`
        : `<p>${esc(String(i.text ?? '').trim()).replace(/\r?\n/g, '<br/>')}</p>`;
    return `    <div class="info-card reveal"${delay(n, 0.08)}>
      <div class="info-ico">${esc(i.icon)}</div>
      <h4>${esc(i.title)}</h4>
      ${body}
    </div>`;
  })
  .join('\n')}
  </div>
</section>`;

  // FOOTER
  const f = c.footer;
  const footer = `<footer>
  <div class="footer-grid">
    <div class="f-brand">
      <a href="#" class="nav-logo">${logo}</a>
      <p>${esc(f.about)}</p>
    </div>
    <div class="f-col">
      <h5>${esc(f.servicesTitle)}</h5>
      <ul>
${arr(f.services)
  .map(
    (i) =>
      `        <li><a href="${esc(waLink(wa, i.waText))}" target="_blank" rel="noopener">${esc(i.label)}</a></li>`
  )
  .join('\n')}
      </ul>
    </div>
    <div class="f-col">
      <h5>${esc(f.contactTitle)}</h5>
      <ul>
        <li><a href="${esc(waLink(wa, ''))}" target="_blank" rel="noopener">WA: ${esc(waLocal(wa))}</a></li>
        <li><a href="tel:${esc(phoneIntl(c.site.phone))}">Telp: ${esc(c.site.phoneLabel)}</a></li>
        <li><a href="mailto:${esc(c.site.email)}">${esc(c.site.email)}</a></li>
        <li><a href="https://instagram.com/${esc(String(c.site.instagram).replace(/^@/, ''))}" target="_blank" rel="noopener">@${esc(String(c.site.instagram).replace(/^@/, ''))}</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>${esc(f.copyright)}</p>
    <p>${esc(f.tagline)} · <a href="${esc(waLink(wa, ''))}">Hubungi Kami</a></p>
  </div>
</footer>`;

  const floatWa = `<a href="${esc(waLink(wa, c.site.floatWaText))}" class="wa-float" target="_blank" rel="noopener" title="Chat via WhatsApp" aria-label="Chat via WhatsApp">${WA_SVG}</a>`;

  const body = [
    nav,
    hero,
    show('trust') && trust,
    show('promos') && promos,
    show('services') && services,
    show('certifications') && certifications,
    show('doctors') && doctors,
    show('how') && how,
    show('testimonials') && testimonials,
    show('articles') && articles,
    show('cta') && cta,
    show('info') && info,
    footer,
    floatWa,
  ]
    .filter(Boolean)
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${esc(c.site.title)}</title>
  <meta name="description" content="${esc(c.site.description)}"/>
  <meta property="og:title" content="${esc(c.site.title)}"/>
  <meta property="og:description" content="${esc(c.site.description)}"/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="/style.css?v=${esc(opts.assetVersion || '1')}"/>
  <style>${themeCss}</style>
</head>
<body>

${body}

<script src="/site.js" defer></script>${opts.preview ? PREVIEW_JS : ''}
</body>
</html>
`;
}

function phoneIntl(p) {
  const d = digits(p);
  if (d.startsWith('62')) return '+' + d;
  if (d.startsWith('0')) return '+62' + d.slice(1);
  return '+' + d;
}

function waLocal(num) {
  const d = digits(num);
  const local = d.startsWith('62') ? '0' + d.slice(2) : d;
  return local.replace(/^(\d{4})(\d{4})(\d+)$/, '$1-$2-$3');
}

module.exports = { renderPage, esc, rich, safeUrl, safeImg, digits, hex };
