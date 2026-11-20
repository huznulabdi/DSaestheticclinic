// Konten bawaan situs (diambil dari index.html asli).
// Dipakai saat database masih kosong, dan sebagai cadangan jika Upstash tidak bisa dijangkau.
// Aturan penulisan teks:
//   *kata*   -> ditampilkan miring berwarna emas
//   baris baru -> <br>
module.exports = {
  site: {
    name1: 'DS',
    name2: 'Aesthetic',
    name3: 'Clinic',
    title: 'DS Aesthetic Clinic — Kecantikan Sejati Dimulai di Sini',
    description:
      'Klinik estetika medis bersertifikasi dengan dokter spesialis. Konsultasi pertama gratis.',
    whatsapp: '6285333444064',
    phone: '02112345678',
    phoneLabel: '(021) 123-4567',
    email: 'hello@dsaesthetic.id',
    instagram: 'dsaestheticclinic',
    floatWaText: 'Halo DS Aesthetic Clinic, saya ingin konsultasi!',
  },

  theme: {
    gold: '#C9973E',
    goldDeep: '#9C7430',
    goldBright: '#E8A840',
    goldLight: '#E8CFA0',
    goldPale: '#F8F0E0',
    cream: '#FDFAF4',
    ivory: '#F5EED8',
    charcoal: '#1C1A16',
    warmMid: '#6B5F4A',
  },

  layout: {
    show: {
      trust: true,
      promos: true,
      services: true,
      certifications: true,
      doctors: true,
      how: true,
      testimonials: true,
      articles: true,
      cta: true,
      info: true,
    },
  },

  nav: {
    links: [
      { label: 'Promo', target: '#promos' },
      { label: 'Layanan', target: '#services' },
      { label: 'Dokter', target: '#doctors' },
      { label: 'Artikel', target: '#articles' },
      { label: 'Info', target: '#info' },
    ],
    ctaLabel: 'Konsultasi Gratis',
    ctaWaText: 'Halo DS Aesthetic Clinic, saya ingin konsultasi gratis',
  },

  hero: {
    badge: 'Klinik Kecantikan Bersertifikasi',
    promoTag: '✦ Promo Spesial — Hemat hingga 50% Bulan Ini ✦',
    title: 'Tampil *Cantik & Percaya Diri*\nBersama Dokter Ahli Kami',
    sub:
      'Rasakan transformasi kecantikan yang sesungguhnya. Perawatan medis estetika berstandar internasional, ditangani langsung oleh dokter spesialis bersertifikasi.',
    statLeftLabel: 'Pasien Puas',
    statLeftValue: '500+',
    statRightLabel: 'Rating Klien',
    statRightValue: '4.9 ★',
    pills: [
      { big: 'GRATIS', small: 'Konsultasi Awal' },
      { big: '50%', small: 'Diskon Perawatan Perdana' },
      { big: 'FREE', small: 'Starter Skincare Kit' },
    ],
    ctaLabel: 'Daftar Sekarang via WA',
    ctaWaText: 'Halo, saya ingin daftar konsultasi gratis di DS Aesthetic Clinic!',
    ctaSecondaryLabel: 'Lihat Promo',
    ctaSecondaryTarget: '#promos',
  },

  trust: {
    items: [
      { icon: '🏆', title: 'Bersertifikasi Kemenkes', sub: 'Izin Operasional Resmi' },
      { icon: '👩‍⚕️', title: 'Dokter Spesialis', sub: 'PERDOSKI & IDI Certified' },
      { icon: '💉', title: 'Alat Medis Berstandar', sub: 'Steril & Tersertifikasi' },
      { icon: '⭐', title: '500+ Pasien Puas', sub: 'Rating 4.9 / 5.0' },
    ],
  },

  promos: {
    label: 'Penawaran Terbatas',
    title: 'Promo *Spesial* Maret',
    btnLabel: 'Pesan Sekarang',
    items: [
      {
        show: true,
        badge: '🔥 Terlaris',
        name: 'Premium Acne Scar',
        desc: 'CO2 + HAURORA SCAR, Free Anti Iritasi.',
        price: 'Rp 2.700K',
        oldPrice: 'Rp 4,5 jt',
        discount: 'HEMAT 40%',
        waText: 'Halo, saya ingin memesan Paket Premium AcneScar di DS Aesthetic Clinic',
      },
      {
        show: true,
        badge: '⚡ Promo Baru',
        name: 'HAURORA GLASS SKINBOOSTER',
        desc: '...',
        price: 'Rp 1,2 jt',
        oldPrice: 'Rp 2 jt',
        discount: 'HEMAT 40%',
        waText: 'Halo, saya ingin memesan Paket HAURORA GLASS SKINBOOSTER',
      },
      {
        show: true,
        badge: '💎 Premium',
        name: 'PICO GLOW REJUVE',
        desc: '...',
        price: 'Rp 750k',
        oldPrice: 'Rp 1,5 jt',
        discount: 'HEMAT 50%',
        waText: 'Halo, saya ingin memesan Paket PICO GLOW REJUVE',
      },
      {
        // Kartu ini dinonaktifkan di index.html asli (dikomentari)
        show: false,
        badge: '✨ Paket Hemat',
        name: 'Laser Rejuvenation',
        desc:
          'Teknologi laser terkini untuk mengatasi bekas jerawat, flek hitam, dan pori-pori besar secara efektif.',
        price: 'Rp 1,8 jt',
        oldPrice: 'Rp 2,8 jt',
        discount: 'HEMAT 35%',
        waText: 'Halo, saya ingin memesan Paket Laser Rejuvenation',
      },
    ],
  },

  services: {
    label: 'Layanan Unggulan',
    title: 'Semua Kebutuhan *Kecantikan* Anda',
    btnLabel: 'Tanya Layanan Lainnya',
    btnWaText: 'Halo, saya ingin mengetahui layanan DS Aesthetic Clinic',
    items: [
      { icon: '💉', name: 'Botox & Filler', desc: 'Peremajaan wajah instan, anti-kerutan dan kontur sempurna' },
      { icon: '✨', name: 'Laser Treatment', desc: 'Flek, jerawat, dan bekas luka teratasi dengan teknologi terkini' },
      { icon: '💧', name: 'HydraFacial', desc: 'Pembersihan mendalam, eksfoliasi, dan hidrasi intensif' },
      { icon: '🌿', name: 'IV Drip Vitamin', desc: 'Glowing dari dalam dengan infus vitamin C, glutathione, kolagen' },
      { icon: '🎯', name: 'Threadlift', desc: 'Angkat wajah non-bedah untuk tampil lebih muda dan kencang' },
      { icon: '🧪', name: 'Chemical Peel', desc: 'Kulit lebih cerah, halus dan bebas noda dengan peeling medis' },
    ],
  },

  certifications: {
    label: 'Kepercayaan & Keamanan',
    title: 'Klinik *Bersertifikasi* & Terpercaya',
    items: [
      { title: 'Izin Kemenkes RI', desc: 'Beroperasi secara legal dengan izin resmi dari Kementerian Kesehatan Republik Indonesia.' },
      { title: 'Sertifikasi PERDOSKI', desc: 'Dokter kami anggota aktif Perhimpunan Dokter Spesialis Kulit dan Kelamin Indonesia.' },
      { title: 'Standar ISO Medis', desc: 'Peralatan dan prosedur mengikuti standar internasional untuk keamanan dan sterilisasi.' },
      { title: 'BPOM Approved', desc: 'Seluruh produk dan bahan yang digunakan telah mendapat persetujuan dari BPOM RI.' },
    ],
  },

  doctors: {
    label: 'Tim Medis Kami',
    title: 'Ditangani *Dokter Spesialis* Berpengalaman',
    items: [
      {
        icon: '👩‍⚕️',
        photo: '',
        name: 'dr. Diana Sari, Sp.KK',
        spec: 'Spesialis Dermatologi & Estetika',
        tags: '12 Thn Pengalaman, PERDOSKI',
        desc: 'Ahli di bidang peremajaan kulit, laser treatment, dan prosedur estetika wajah non-bedah.',
      },
      {
        icon: '👨‍⚕️',
        photo: '',
        name: 'dr. Reza Hartanto, Sp.KK',
        spec: 'Spesialis Kulit & Estetika',
        tags: '9 Thn Pengalaman, PERDOSKI',
        desc: 'Berpengalaman dalam botox, filler, threadlift, dan penanganan masalah kulit kronis.',
      },
      {
        icon: '👩‍⚕️',
        photo: '',
        name: 'dr. Anisa Putri, M.Kes',
        spec: 'Dokter Estetika & Anti-Aging',
        tags: '7 Thn Pengalaman, IDI',
        desc: 'Spesialis perawatan anti-aging, IV therapy, dan konsultasi kecantikan holistik.',
      },
    ],
  },

  how: {
    label: 'Proses Mudah',
    title: '4 Langkah *Memulai* Perjalanan Cantikmu',
    btnLabel: 'Mulai Konsultasi Gratis',
    btnWaText: 'Halo, saya ingin mulai konsultasi di DS Aesthetic Clinic',
    steps: [
      { title: 'Konsultasi via WA', desc: 'Hubungi kami via WhatsApp, ceritakan kondisi kulit & tujuan perawatanmu' },
      { title: 'Jadwalkan Kunjungan', desc: 'Pilih waktu yang sesuai, konfirmasi jadwal dalam 10 menit' },
      { title: 'Analisa Kulit', desc: 'Dokter kami merancang rencana perawatan terbaik untuk kulitmu' },
      { title: 'Mulai Perawatan', desc: 'Nikmati prosedur estetika premium dan tampilkan versi terbaik dirimu' },
    ],
  },

  testimonials: {
    label: 'Cerita Pasien Kami',
    title: 'Ribuan Pasien *Sudah Merasakan* Manfaatnya',
    items: [
      {
        stars: 5,
        text: 'Setelah 3 sesi laser treatment, kulit saya jauh lebih cerah dan bekas jerawat hampir tidak terlihat. Dokternya ramah dan profesional banget!',
        avatar: '😊',
        name: 'Rina Kartika',
        detail: 'Laser Treatment · Jakarta',
      },
      {
        stars: 5,
        text: 'Suntik filler hasilnya alami banget, tidak terlihat palsu. Tim dokternya sangat berpengalaman dan saya merasa aman sepanjang prosedur.',
        avatar: '🌸',
        name: 'Maharani D.',
        detail: 'Nose Filler · Surabaya',
      },
      {
        stars: 5,
        text: 'Paket glowing skin-nya worth it banget! Wajah langsung cerah setelah treatment, banyak teman yang nanya pakai skincare apa. Highly recommended!',
        avatar: '💫',
        name: 'Sasha Amelia',
        detail: 'Glowing Skin Package · Bandung',
      },
    ],
  },

  articles: {
    label: 'Edukasi Kecantikan',
    title: 'Artikel & *Tips* Kecantikan',
    linkLabel: 'Konsultasi →',
    btnLabel: 'Tanya Dokter Langsung',
    btnWaText: 'Halo, saya ingin konsultasi seputar kecantikan',
    items: [
      {
        icon: '🌟',
        tag: 'Perawatan Kulit',
        title: '5 Tanda Kulitmu Butuh Laser Treatment Sekarang',
        desc: 'Kenali gejala-gejala ini sebelum terlambat. Flek hitam, pori besar, dan tekstur tidak merata bisa diatasi secara efektif.',
        date: '12 Maret 2025',
        waText: 'Halo, saya ingin tanya tentang Laser Treatment',
      },
      {
        icon: '💧',
        tag: 'Anti-Aging',
        title: 'Botox vs Filler: Mana yang Tepat untuk Anda?',
        desc: 'Banyak yang masih bingung perbedaan botox dan filler. Simak panduan lengkap dari dokter spesialis kami.',
        date: '5 Maret 2025',
        waText: 'Halo, saya ingin konsultasi tentang Botox vs Filler',
      },
      {
        icon: '✨',
        tag: 'Tips Kecantikan',
        title: 'Rutinitas Skincare Setelah Aesthetic Treatment',
        desc: 'Perawatan pasca-treatment menentukan hasil akhir. Ikuti panduan ini untuk hasil optimal dan tahan lama.',
        date: '28 Feb 2025',
        waText: 'Halo, saya ingin tanya tentang perawatan pasca treatment',
      },
    ],
  },

  cta: {
    label: 'Jangan Tunda Lagi',
    title: 'Mulai Perjalanan *Cantikmu* Hari Ini',
    desc: 'Konsultasi pertama GRATIS. Tim dokter kami siap membantu menemukan solusi kecantikan terbaik yang sesuai kondisi kulitmu.',
    waLabel: 'Chat WhatsApp Sekarang',
    waText: 'Halo DS Aesthetic Clinic, saya ingin daftar konsultasi gratis sekarang!',
    callLabel: '📞 Hubungi Kami',
  },

  info: {
    label: 'Informasi Klinik',
    title: 'Yang Perlu *Anda Ketahui*',
    cards: [
      {
        icon: '🕐',
        title: 'Jam Operasional',
        format: 'list',
        text: 'Senin – Jumat: 09.00 – 20.00\nSabtu: 09.00 – 18.00\nMinggu: 10.00 – 15.00\nLibur Nasional: Tutup',
      },
      {
        icon: '📍',
        title: 'Lokasi Klinik',
        format: 'text',
        text: 'Jl. Sudirman No. 88, Lantai 3\nJakarta Pusat, DKI Jakarta 10220\n\nParkir tersedia · Dekat Stasiun MRT',
      },
      {
        icon: '💳',
        title: 'Metode Pembayaran',
        format: 'list',
        text: 'Tunai (Cash)\nTransfer & QRIS\nKartu Kredit / Debit\nCicilan 0% — 12 Bulan',
      },
      {
        icon: '📋',
        title: 'Persiapan Kunjungan',
        format: 'list',
        text: 'Datang tanpa riasan wajah\nBawa KTP untuk registrasi\nInformasikan riwayat alergi\nKonsultasi via WA terlebih dahulu',
      },
    ],
  },

  footer: {
    about:
      'Klinik estetika medis bersertifikasi yang menghadirkan perawatan kecantikan terbaik dengan sentuhan personal dan standar medis tertinggi.',
    servicesTitle: 'Layanan',
    contactTitle: 'Kontak',
    services: [
      { label: 'Botox & Filler', waText: 'Saya ingin tahu tentang Botox & Filler' },
      { label: 'Laser Treatment', waText: 'Saya ingin tahu tentang Laser Treatment' },
      { label: 'HydraFacial', waText: 'Saya ingin tahu tentang HydraFacial' },
      { label: 'IV Drip Vitamin', waText: 'Saya ingin tahu tentang IV Drip Vitamin' },
      { label: 'Threadlift', waText: 'Saya ingin tahu tentang Threadlift' },
    ],
    copyright: '© 2025 DS Aesthetic Clinic. Seluruh hak dilindungi.',
    tagline: 'Dibuat dengan ❤️',
  },
};
