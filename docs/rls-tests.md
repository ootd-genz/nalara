# Panduan & Skrip Uji Row Level Security (RLS) Supabase — NALARA

Dokumen ini berisi daftar skrip pengujian keamanan tingkat baris (Row Level Security / RLS) pada database Supabase proyek NALARA untuk tabel `public.site_users` dan `public.admins`, serta fungsi RPC `public.get_slug_status`.

Anda dapat menjalankan query di bawah ini secara manual melalui **Supabase Dashboard → SQL Editor**. Skrip dirancang menggunakan blok transaksi (`BEGIN; ... ROLLBACK;`) sehingga Anda dapat menguji tanpa mengubah atau mengotori data riil.

---

## 1. Ringkasan Kebijakan RLS

| Tabel / Objek | Role / Target | Operasi | Kebijakan & Harapan |
| :--- | :--- | :--- | :--- |
| `public.site_users` | `anon` | SELECT | **Hanya user aktif** (`is_active = true`). User nonaktif disembunyikan. |
| `public.site_users` | `anon` | INSERT/UPDATE/DELETE | **DITOLAK**. Pengunjung anonim dilarang memanipulasi data. |
| `public.site_users` | `authenticated` (bukan admin) | SELECT | **Hanya user aktif** (`is_active = true`). |
| `public.site_users` | `authenticated` (bukan admin) | INSERT/UPDATE/DELETE | **DITOLAK**. User biasa dilarang memanipulasi data. |
| `public.site_users` | `authenticated` (admin) | SELECT/ALL | **LULUS SEMUA**. Admin dapat membaca data aktif, nonaktif, dan melakukan mutasi. |
| `public.admins` | `authenticated` | SELECT | Hanya dapat melihat record miliknya sendiri (`user_id = auth.uid()`). |
| `public.get_slug_status` | `anon` & `authenticated` | EXECUTE | **LULUS**. Mengembalikan `'active'`, `'inactive'`, atau `'missing'`. |

---

## 2. Skrip Uji Siap Pakai di Supabase SQL Editor

Jalankan blok pengujian di bawah ini di SQL Editor. Seluruh operasi dibungkus dalam transaksi `ROLLBACK` agar tidak ada efek permanen.

```sql
-- ==============================================================================
-- PENGUJIAN KOMPREHENSIF RLS NALARA (site_users & admins)
-- ==============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- SETUP DATA UJI SEMENTARA
-- -----------------------------------------------------------------------------
-- Buat ID dummy untuk admin dan non-admin
CREATE TEMP TABLE test_fixtures AS
SELECT
  gen_random_uuid() AS admin_id,
  gen_random_uuid() AS non_admin_id;

-- Daftarkan admin_id ke tabel public.admins
INSERT INTO public.admins (user_id)
SELECT admin_id FROM test_fixtures;

-- Buat 1 user aktif dan 1 user nonaktif di site_users
INSERT INTO public.site_users (id, name, slug, phone_raw, phone_wa, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'User Uji Aktif', 'uji-aktif', '081234567890', '6281234567890', true),
  ('00000000-0000-0000-0000-000000000002', 'User Uji Nonaktif', 'uji-nonaktif', '081234567891', '6281234567891', false);


-- =============================================================================
-- SKENARIO 1: ROLE ANON (Pengunjung Publik Tanpa Login)
-- =============================================================================
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claim.sub" TO '';

-- 1.1 SELECT: Hanya boleh melihat user aktif
SELECT count(*) AS anon_active_seen
FROM public.site_users
WHERE slug = 'uji-aktif';
-- Ekspektasi: 1

SELECT count(*) AS anon_inactive_seen
FROM public.site_users
WHERE slug = 'uji-nonaktif';
-- Ekspektasi: 0 (Tersembunyi oleh RLS)

-- 1.2 INSERT: Harus ditolak
DO $$
BEGIN
  BEGIN
    INSERT INTO public.site_users (name, slug, phone_raw, phone_wa, is_active)
    VALUES ('Hacker Anon', 'hacker-anon', '081111111111', '628111111111', true);
    RAISE EXCEPTION 'GAGAL: anon berhasil melakukan INSERT!';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'LULUS: INSERT anon ditolak oleh izin/RLS.';
  END;
END $$;

-- 1.3 UPDATE: Tidak boleh mengubah baris
UPDATE public.site_users
SET name = 'Nama Dimanipulasi'
WHERE slug = 'uji-aktif';
-- Ekspektasi: 0 rows updated

-- 1.4 DELETE: Tidak boleh menghapus baris
DELETE FROM public.site_users
WHERE slug = 'uji-aktif';
-- Ekspektasi: 0 rows deleted

-- 1.5 RPC get_slug_status: Publik boleh mengecek status slug
SELECT
  public.get_slug_status('uji-aktif')    AS status_aktif,     -- Ekspektasi: 'active'
  public.get_slug_status('uji-nonaktif') AS status_nonaktif,  -- Ekspektasi: 'inactive'
  public.get_slug_status('tidak-ada')    AS status_missing;   -- Ekspektasi: 'missing'


-- =============================================================================
-- SKENARIO 2: ROLE AUTHENTICATED NON-ADMIN (User Login Biasa)
-- =============================================================================
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', non_admin_id::text, true)
FROM test_fixtures;

-- 2.1 SELECT: Hanya boleh melihat user aktif
SELECT count(*) AS nonadmin_active_seen
FROM public.site_users
WHERE slug = 'uji-aktif';
-- Ekspektasi: 1

SELECT count(*) AS nonadmin_inactive_seen
FROM public.site_users
WHERE slug = 'uji-nonaktif';
-- Ekspektasi: 0

-- 2.2 INSERT: Ditolak oleh policy RLS
DO $$
BEGIN
  BEGIN
    INSERT INTO public.site_users (name, slug, phone_raw, phone_wa, is_active)
    VALUES ('Non Admin User', 'non-admin', '082222222222', '628222222222', true);
    RAISE EXCEPTION 'GAGAL: non-admin berhasil melakukan INSERT!';
  EXCEPTION
    WHEN insufficient_privilege OR check_violation THEN
      RAISE NOTICE 'LULUS: INSERT non-admin ditolak oleh RLS.';
  END;
END $$;

-- 2.3 UPDATE: Tidak boleh mengubah baris
UPDATE public.site_users
SET name = 'Nama Dimanipulasi NonAdmin'
WHERE slug = 'uji-aktif';
-- Ekspektasi: 0 rows updated

-- 2.4 DELETE: Tidak boleh menghapus baris
DELETE FROM public.site_users
WHERE slug = 'uji-aktif';
-- Ekspektasi: 0 rows deleted

-- 2.5 CEK TABEL ADMINS: Tidak boleh melihat record admin orang lain
SELECT count(*) AS admins_seen_by_non_admin
FROM public.admins;
-- Ekspektasi: 0


-- =============================================================================
-- SKENARIO 3: ROLE AUTHENTICATED ADMIN (Admin yang Sah di tabel public.admins)
-- =============================================================================
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', admin_id::text, true)
FROM test_fixtures;

-- 3.1 SELECT: Admin harus melihat semua user (aktif maupun nonaktif)
SELECT count(*) AS admin_total_seen
FROM public.site_users
WHERE slug IN ('uji-aktif', 'uji-nonaktif');
-- Ekspektasi: 2

-- 3.2 INSERT: Admin berhasil menambah user baru
INSERT INTO public.site_users (name, slug, phone_raw, phone_wa, is_active)
VALUES ('Mitra Baru Admin', 'mitra-baru-admin', '089517795206', '6289517795206', true);
-- Ekspektasi: 1 row inserted

-- 3.3 UPDATE: Admin berhasil mengubah nama, nomor, dan status
UPDATE public.site_users
SET phone_wa = '6289999999999', is_active = false
WHERE slug = 'mitra-baru-admin';
-- Ekspektasi: 1 row updated

-- 3.4 DELETE: Admin berhasil menghapus user
DELETE FROM public.site_users
WHERE slug = 'mitra-baru-admin';
-- Ekspektasi: 1 row deleted

-- 3.5 CEK TABEL ADMINS: Admin dapat melihat row dirinya sendiri
SELECT count(*) AS own_admin_row_seen
FROM public.admins;
-- Ekspektasi: 1

-- -----------------------------------------------------------------------------
-- BATALKAN TRANSAKSI (Tidak ada data dummy yang tertinggal)
-- -----------------------------------------------------------------------------
ROLLBACK;
```

---

## 3. Hasil & Bukti Pengujian

Jika seluruh blok di atas dieksekusi di Supabase SQL Editor:
1. Pesan `NOTICE: LULUS: INSERT anon ditolak oleh izin/RLS.` tampil.
2. Pesan `NOTICE: LULUS: INSERT non-admin ditolak oleh RLS.` tampil.
3. Seluruh query `UPDATE` dan `DELETE` oleh `anon` dan `non-admin` berdampak pada `0 rows`.
4. Seluruh query mutasi oleh `admin` berhasil mengeksekusi `1 row`.
5. `ROLLBACK` memastikan database tetap bersih dalam kondisi awal.
