# DS Aesthetic Clinic

Website klinik dengan panel admin. Semua teks, ikon, harga, daftar promo/layanan/dokter,
nomor WhatsApp, dan warna tema bisa diubah dari `/admin` tanpa menyentuh kode.

- **Hosting:** Vercel (halaman statis + Serverless Functions)
- **Database:** Upstash Redis (satu key JSON berisi seluruh konten)
- **Foto:** Vercel Blob (store bertipe Public)
- **Halaman publik** dirender di server dari data tersebut, jadi tetap ramah SEO dan tanpa kedipan.

## Struktur

```
api/page.js        halaman publik (dirender dari Upstash; cadangan: lib/defaults.js)
api/auth.js        login / logout / cek sesi
api/content.js     baca, simpan, reset konten (khusus admin)
api/preview.js     pratinjau konten yang belum disimpan (khusus admin)
api/upload.js      unggah foto ke Vercel Blob (khusus admin)
lib/defaults.js    isi bawaan = isi index.html lama
lib/render.js      template halaman
lib/content.js     validasi & pembersihan data
lib/store.js       koneksi Upstash + pembatas percobaan login
lib/auth.js        sesi cookie bertanda tangan
public/style.css   gaya (tema lewat CSS variables)
public/site.js     animasi scroll
public/admin/      panel admin
vercel.json        "/" → api/page, header keamanan untuk /admin
```

## Deploy

1. **Buat database Upstash.** Di console.upstash.com → *Create Database* (Redis), pilih region
   terdekat dengan region function Vercel Anda. Salin `UPSTASH_REDIS_REST_URL` dan
   `UPSTASH_REDIS_REST_TOKEN` dari tab *REST API*.
   (Jika memasang Upstash lewat Vercel Marketplace, variabel `KV_REST_API_URL` dan
   `KV_REST_API_TOKEN` otomatis dikenali; tidak perlu diubah namanya.)
2. **Push kode ke GitHub** (ganti isi repo lama dengan folder ini; `index.html` lama tidak
   dipakai lagi karena kontennya sudah ada di `lib/defaults.js`).
3. **Import repo di Vercel** (*Add New → Project*). Framework Preset: **Other**. Biarkan
   Build Command kosong.
4. **Buat Blob store untuk foto** (lihat bagian *Foto dengan Vercel Blob* di bawah).
5. **Isi Environment Variables** (lihat `.env.example`): `UPSTASH_REDIS_REST_URL`,
   `UPSTASH_REDIS_REST_TOKEN`, `ADMIN_PASSWORD`, `SESSION_SECRET`. Lalu *Deploy*.
6. Buka `https://domain-anda.vercel.app/admin`, masuk, ubah isi, klik **Simpan perubahan**.

Setelah mengubah environment variable, lakukan **Redeploy** agar berlaku.

## Foto dengan Vercel Blob

1. Di dashboard Vercel buka project → tab **Storage** → **Create Database/Store** → pilih **Blob**.
2. Pilih akses **Public** (foto harus bisa dilihat pengunjung), beri nama, lalu hubungkan ke project ini.
   Vercel otomatis menambahkan `BLOB_READ_WRITE_TOKEN` ke environment variables project.
3. **Redeploy** agar token terbaca.
4. Di `/admin` → **Dokter** → buka seorang dokter → **Unggah foto**. Foto dikecilkan otomatis di
   browser (maks ±1000 px, JPEG), diunggah, lalu klik **Simpan perubahan**.

Untuk pengembangan lokal: `vercel link` lalu `vercel env pull .env.local` mengambil token tersebut.
Foto lama yang diganti tidak dihapus otomatis dari Blob; hapus manual lewat dashboard bila perlu.

Field foto bisa dipakai di bagian lain: di `SCHEMA` pada admin, gunakan
`{ k: 'namaKolom', t: 'image', l: 'Label' }`, lalu tampilkan nilainya (lewat `safeImg`) di `lib/render.js`.

## Cara kerja singkat

- Database kosong → website tampil memakai isi bawaan. Setelah admin menyimpan pertama kali,
  isi dari Upstash yang dipakai.
- Setiap penyimpanan menyalin versi sebelumnya ke key `ds:content:backup`.
- Halaman publik di-cache di edge Vercel ±15 detik, sehingga perubahan muncul dalam
  hitungan detik dan pembacaan ke Redis tetap hemat.
- Format teks: `*kata*` jadi miring emas; baris baru jadi `<br>`. Tidak ada HTML mentah,
  jadi isi yang dimasukkan admin tidak bisa menyuntikkan skrip.

## Keamanan

- Sesi: cookie `HttpOnly`, `Secure`, `SameSite=Strict`, berlaku 7 hari, ditandatangani HMAC.
- Login dibatasi 8 percobaan per 15 menit per IP (disimpan di Redis).
- Semua endpoint yang mengubah data menolak permintaan lintas-situs dan wajib login.
- Gunakan `ADMIN_PASSWORD` yang panjang dan unik. Ganti `SESSION_SECRET` untuk
  mengeluarkan semua sesi yang sedang login.

## Pengembangan lokal

```bash
npm install
npm i -g vercel
cp .env.example .env.local   # isi nilainya
vercel dev                   # buka http://localhost:3000 dan /admin
```

## Menambah bagian atau kolom baru

1. Tambahkan kunci & nilai bawaannya di `lib/defaults.js`.
2. Tampilkan di `lib/render.js`.
3. Tambahkan field-nya di `SCHEMA` pada `public/admin/index.html`.

Validasi (`lib/content.js`) mengikuti bentuk `defaults.js`, jadi tidak perlu diubah.
