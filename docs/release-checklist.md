# Checklist Rilis Produksi & Prosedur Rollback — NALARA

Dokumen ini berisi panduan operasional langkah demi langkah untuk merilis fitur User Pages (`/[slug]`) dan Admin Panel (`/admin`) ke lingkungan produksi, lengkap dengan pengujian pasca-deploy (*smoke testing*) dan skenario *rollback* darurat.

---

## 1. Tahap Pra-Deploy: Persiapan Database & Lingkungan

### Langkah 1.1: Konfigurasi Environment Variables di Hosting (Vercel / VPS)
Pastikan variabel lingkungan berikut telah ditambahkan di dashboard hosting Anda:

```env
NEXT_PUBLIC_SITE_URL=https://nalara.id
NEXT_PUBLIC_SUPABASE_URL=https://ltcrjmuursfcxmwaucro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi... (anon key produksi)
# Opsional jika integrasi pembayaran aktif:
SUPABASE_SERVICE_ROLE_KEY=ey... (HANYA server-side, JANGAN pakai prefix NEXT_PUBLIC_)
```

> [!CAUTION]
> Jangan pernah memasukkan `SUPABASE_SERVICE_ROLE_KEY` ke dalam bundle client atau menambahkan prefix `NEXT_PUBLIC_`.

---

### Langkah 1.2: Jalankan Migrasi SQL di Supabase Produksi
Buka **Supabase Dashboard → SQL Editor** pada proyek produksi Anda, lalu eksekusi berkas migrasi berikut secara berurutan:

1. **`supabase/migrations/202611060001_site_users.sql`**:
   - Membuat ekstensi `pgcrypto`.
   - Membuat tabel `public.site_users` dan index parsial `site_users_active_slug_idx`.
   - Membuat fungsi trigger `set_site_users_updated_at`.
   - Membuat tabel `public.admins`.
   - Mengaktifkan Row Level Security (RLS) serta mendefinisikan policy `public read active users`, `admin full access`, dan `read own admin row`.

2. **`supabase/migrations/202611060002_get_slug_status.sql`**:
   - Membuat fungsi RPC `public.get_slug_status` (`security definer`) untuk pengecekan status slug secara aman tanpa mengekspos nomor telepon atau identitas user.

---

### Langkah 1.3: Buat Akun Admin Produksi
1. Masuk ke **Supabase Dashboard → Authentication → Users**.
2. Klik tombol **Add User → Create User**:
   - Email: `admin@nalara.id` (atau email resmi admin)
   - Password: Buat password yang kuat (minimal 12 karakter kombinasi)
   - Auto Confirm User: **Centang (Yes)**
3. Salin `User UID` yang baru terbentuk (misal: `11111111-2222-3333-4444-555555555555`).
4. Buka **SQL Editor** dan jalankan query:
   ```sql
   INSERT INTO public.admins (user_id)
   VALUES ('11111111-2222-3333-4444-555555555555')
   ON CONFLICT (user_id) DO NOTHING;
   ```
5. Verifikasi bahwa row admin berhasil tersimpan:
   ```sql
   SELECT * FROM public.admins;
   ```

---

## 2. Tahap Deployment

### Langkah 2.1: Verifikasi Lokal Terakhir Sebelum Push
Pastikan seluruh pipeline verifikasi di lokal berstatus lulus:
```bash
npm test
npm run typecheck
npm run lint
npm run build
```

### Langkah 2.2: Push & Deploy
1. Push branch `feat/user-pages` atau buat Pull Request ke `main`.
2. Tunggu proses CI/CD dan deployment Vercel/VPS selesai hingga status `Ready` (HTTP 200).

---

## 3. Tahap Pasca-Deploy: Smoke Test Produksi

Jalankan pengujian langsung di browser pada domain produksi untuk memastikan fungsi berjalan sempurna:

| No | Lokasi URL | Tindakan Pengujian | Hasil yang Diharapkan | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1 | `/` | Buka halaman utama | Halaman terbuka normal, tampilan identik dengan versi sebelumnya. | [ ] |
| 2 | `/` | Klik tombol "Konsultasi" di Hero & Footer | Mengarah ke `wa.me/6283829198193` (nomor resmi NALARA). | [ ] |
| 3 | `/admin` | Buka tanpa login | Otomatis dialihkan (*redirect*) ke `/admin/login`. | [ ] |
| 4 | `/admin/login` | Login dengan akun non-admin | Muncul pesan error akses ditolak (*Forbidden*). | [ ] |
| 5 | `/admin/login` | Login dengan akun admin resmi | Berhasil masuk ke dashboard `/admin`. | [ ] |
| 6 | `/admin` | Tambah user: `Ahmad Habibi` (`089517795206`) | Tersimpan dengan slug `ahmad-habibi`, URL `https://domain.com/ahmad-habibi` muncul di tabel. | [ ] |
| 7 | `/ahmad-habibi` | Buka URL user di tab baru/incognito | Tampilan persis sama dengan `/`, metadata `noindex` aktif, canonical mengarah ke `/`. | [ ] |
| 8 | `/ahmad-habibi` | Klik CTA Hero, Beginner, Starter, Business, Floating WA | **Semua tombol** mengarah ke `wa.me/6289517795206` dengan teks pre-filled yang benar. | [ ] |
| 9 | `/admin` | Geser toggle user `ahmad-habibi` menjadi **Nonaktif** | Status berubah menjadi Nonaktif. | [ ] |
| 10 | `/ahmad-habibi` | Refresh tab user nonaktif | Otomatis di-redirect ke `/`. | [ ] |
| 11 | `/slug-acak-tidak-ada` | Buka slug sembarang | Muncul halaman 404 (Not Found). | [ ] |
| 12 | `/checkout` | Buka `/checkout` | Redirect ke WhatsApp resmi NALARA. | [ ] |
| 13 | `/checkout?ref=ahmad-habibi` | Buka checkout dengan parameter ref user | Redirect ke WhatsApp user `6289517795206`. | [ ] |
| 14 | `/robots.txt` & `/sitemap.xml` | Cek isi robots dan sitemap | URL user `/[slug]` dan `/admin` **tidak masuk** sitemap. | [ ] |

---

## 4. Prosedur Rollback Darurat (Emergency Rollback)

Jika ditemukan masalah kritis pasca deploy yang memerlukan rollback cepat:

### Skenario 1: Rollback Versi Kode / Deployment
1. Di dashboard hosting (misal: Vercel):
   - Buka menu **Deployments**.
   - Pilih *deployment* terakhir sebelum fitur ini dirilis.
   - Klik **Promote to Production** atau **Rollback**.
2. Domain akan segera kembali menyajikan landing page versi sebelumnya dalam hitungan detik.

### Skenario 2: Status Database Supabase saat Rollback
> [!NOTE]
> Tabel baru (`public.site_users` dan `public.admins`) serta fungsi `public.get_slug_status` **sangat aman dibiarkan di database**.
> - Tabel tersebut tidak mengganggu tabel pesanan atau alur pembayaran yang sudah ada (`payment_orders`).
> - Tidak perlu melakukan `DROP TABLE` saat rollback deployment kode.
> - Data mitra yang sudah diinput tetap aman tersimpan untuk rilis perbaikan berikutnya.
