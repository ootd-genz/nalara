# Laporan Audit Repo — NALARA Landing Page (Fase 0)

Tanggal Audit: 6 November 2026  
Status Audit: Selesai (Read-Only)  
Branch Kerja: `feat/user-pages`

---

## 1. Versi Dependensi & Script NPM (Aktual dari `package.json`)

### Dependensi Utama
- `next`: `16.2.10`
- `react`: `19.2.7`
- `react-dom`: `19.2.7`
- `typescript`: `5.9.3`
- `tailwindcss`: `4.3.3` (dengan `@tailwindcss/postcss`: `4.3.3`)
- `lucide-react`: `1.25.0`
- `@radix-ui/react-slot`: `1.3.0`
- `class-variance-authority`: `0.7.1`
- `clsx`: `2.1.1`
- `tailwind-merge`: `3.6.0`

### Dependensi Dev & Tooling
- `eslint`: `9.39.5`
- `eslint-config-next`: `16.2.10`
- `@types/node`: `24.4.0`
- `@types/react`: `19.2.17`
- `@types/react-dom`: `19.2.3`
- `postcss`: `8.5.19`

### Status Dependensi Supabase & Midtrans
- `@supabase/supabase-js`: `^2.119.0` (Terpasang)
- `@supabase/ssr`: `^0.12.7` (Terpasang)
- `supabase` CLI: `^3.0.0` (Terpasang di devDependencies)
- SDK Midtrans (`midtrans-client`): Belum terpasang (project saat ini menggunakan client-side Snap script dan direct HTTP fetch).

### Script NPM yang Tersedia
- `npm run dev`: `next dev`
- `npm run build`: `next build`
- `npm run check`: `npm run typecheck && npm run lint && npm run build`
- `npm run start`: `next start`
- `npm run typecheck`: `tsc --noEmit`
- `npm run lint`: `eslint .`

---

## 2. Pemetaan Seluruh Titik WhatsApp / `wa.me`

### A. Titik Konfigurasi & Generator URL Dasar
- **`lib/site-config.ts`**:
  - Baris 6: `whatsappNumber: "6283829198193"` (nomor default NALARA)
  - Baris 16: `whatsappUrl` (`https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessage}`)
  - Baris 18: `beginnerWhatsappUrl` (`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(...)}`)
  - Baris 22: `starterWhatsappUrl` (`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(...)}`)
  - Baris 26: `businessWhatsappUrl` (`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(...)}`)
  - Baris 31: `catalogWhatsappUrl = starterWhatsappUrl` (alias)
  - Baris 32: `onlineStoreWhatsappUrl = businessWhatsappUrl` (alias)

### B. Titik Tautan WhatsApp pada Komponen Landing Page (Target Refactor Fase 2)
1. **`components/sections/hero.tsx`**
   - **Tipe**: Server Component (tanpa `"use client"`)
   - **Baris 7 & 50**: Mengimpor `whatsappUrl` dari `@/lib/site-config`.
   - **Link**: `<a href={whatsappUrl} target="_blank" rel="noreferrer" data-cta="nav-whatsapp">` pada tombol "Konsultasi" di navigasi atas.
2. **`components/sections/offer.tsx`**
   - **Tipe**: Server Component (tanpa `"use client"`)
   - **Baris 6**: Mengimpor `beginnerWhatsappUrl`, `starterWhatsappUrl`, `businessWhatsappUrl`.
   - **Baris 63**: Paket Beginner `<a href={beginnerWhatsappUrl} target="_blank" rel="noreferrer" data-cta="order-beginner-whatsapp">`.
   - **Baris 108**: Paket Starter `<a href={starterWhatsappUrl} target="_blank" rel="noreferrer" data-cta="order-starter-whatsapp">`.
   - **Baris 151**: Paket Business `<a href={businessWhatsappUrl} target="_blank" rel="noreferrer" data-cta="order-business-whatsapp">`.
3. **`components/sections/client-work.tsx`**
   - **Tipe**: Client Component (`"use client"`)
   - **Baris 14 & 167**: Mengimpor `whatsappUrl` dari `@/lib/site-config`.
   - **Link**: `<a href={whatsappUrl} target="_blank" rel="noreferrer" data-cta="portfolio-cta-whatsapp">` pada banner CTA "Konsultasi Sekarang" di bagian bawah portofolio.
4. **`components/sections/footer.tsx`**
   - **Tipe**: Server Component (tanpa `"use client"`)
   - **Baris 4 & 9**: Mengimpor `whatsappUrl` dari `@/lib/site-config`.
   - **Link**: `<a href={whatsappUrl} target="_blank" rel="noreferrer">` pada tombol WhatsApp di footer.
5. **`components/floating-whatsapp.tsx`**
   - **Tipe**: Server Component (tanpa `"use client"`)
   - **Baris 2 & 5**: Mengimpor `whatsappUrl` dari `@/lib/site-config`.
   - **Link**: `<a href={whatsappUrl} target="_blank" rel="noreferrer" className="floating-whatsapp ...">` tombol melayang kanan bawah.
6. **`app/checkout/page.tsx`**
   - **Tipe**: Server Component
   - **Baris 2 & 5**: Mengimpor `whatsappUrl` dari `@/lib/site-config`, langsung melakukan `redirect(whatsappUrl)`.

### C. Komponen yang Tercatat di PRD tetapi Tidak Mengandung Link WA di Kode Aktual
- **`components/sections/announcement.tsx`**: Baris 10 mengarah ke internal hash link `href="#penawaran"`. Tidak mengandung tautan WhatsApp.
- **`components/sections/solutions.tsx`**: Hanya kartu informasi statis, tidak ada tombol atau tautan ke WhatsApp.
- **`components/sections/problems.tsx`**: Kartu edukasi masalah, tidak ada tombol atau tautan ke WhatsApp.

### D. Titik WhatsApp Terkait Pembayaran & Backend (Sesuai Aturan Mutlak 2: Tidak Boleh Diubah)
- **`components/checkout/invoice-status.tsx`** (Client Component): Baris 15, 82, 96 (redirect otomatis ke URL WhatsApp setelah pembayaran sukses atau tombol bantuan).
- **`app/api/payments/status/route.ts`** (Route Handler): Baris 65 membentuk `whatsappUrl` untuk redirect invoice.
- **`app/api/payments/webhook/route.ts`** & **`lib/whatsapp-cloud.ts`**: Pengiriman notifikasi WhatsApp Cloud API otomatis.

---

## 3. Struktur `app/page.tsx` Saat Ini

Komponen adalah **Server Component** murni tanpa logika state atau data fetching:
```tsx
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { Announcement } from "@/components/sections/announcement";
import { ClientWork } from "@/components/sections/client-work";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Offer } from "@/components/sections/offer";
import { Problems } from "@/components/sections/problems";
import { Solutions } from "@/components/sections/solutions";

export default function Home() {
  return (
    <main>
      <Announcement />
      <Hero />
      <Problems />
      <Solutions />
      <ClientWork />
      <Offer />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
```
- **Urutan render**: `Announcement` → `Hero` → `Problems` → `Solutions` → `ClientWork` → `Offer` → `Footer` → `FloatingWhatsApp`.
- **Props**: Tidak ada props yang diteruskan ke masing-masing komponen.

---

## 4. Isi & Perilaku `app/checkout/page.tsx`

```tsx
import { redirect } from "next/navigation";
import { whatsappUrl } from "@/lib/site-config";

export default function CheckoutPage() {
  redirect(whatsappUrl);
}
```
- **Perilaku**: Langsung melakukan HTTP redirect ke `whatsappUrl` (nomor default NALARA) pada sisi server.
- **Kondisi saat ini**: Belum membaca query parameter `?ref=<slug>` untuk diarahkan ke user tertentu.

---

## 5. Metadata Global, Sitemap, dan Robots

### `app/layout.tsx`
- Root layout Server Component.
- Metadata global memuat `metadataBase: new URL(siteUrl)`, title, description, keywords, Open Graph (`id_ID`), Twitter Card, icons, dan `alternates: { canonical: "/" }`.
- Menyetel `<html lang="id" className="scroll-smooth">`.

### `app/sitemap.ts`
- `export const dynamic = "force-static"`
- Mengembalikan array sitemap statis untuk:
  1. `${siteUrl}` (prioritas 1.0)
  2. `${siteUrl}/checkout` (prioritas 0.7)
- URL dinamis user (`/[slug]`) nantinya **tidak boleh** masuk ke sitemap ini.

### `app/robots.ts`
- `export const dynamic = "force-static"`
- `rules: { userAgent: "*", allow: "/" }`
- `sitemap: "${siteUrl}/sitemap.xml"`

---

## 6. Status Supabase

- **Paket NPM**: `@supabase/supabase-js` dan `@supabase/ssr` sudah terpasang di `package.json`.
- **Folder `supabase/`**:
  - `supabase/migrations/202607170001_payment_orders.sql` (tabel pesanan invoice & webhook pembayaran).
  - `supabase/migrations/202611060001_site_users.sql` (tabel `site_users`, `admins`, trigger, dan RLS).
  - Keduanya telah berhasil didorong (*pushed*) ke database remote Supabase proyek **Nalara (`ltcrjmuursfcxmwaucro`)**.
- **Environment Variables**:
  - File `.env.local` sudah ada di root proyek dan sudah masuk ke `.gitignore`.

---

## 7. Status Test Runner & Konfigurasi Lint/Typecheck

- **Test Runner**: Belum ada framework test (`vitest`, `jest`) di `package.json` (akan ditambahkan di Fase 1).
- **Typecheck**: Menggunakan TypeScript 5.9.3 dengan perintah `npm run typecheck` (`tsc --noEmit`). Konfigurasi `tsconfig.json` sudah `strict: true`.
- **Linter**: Menggunakan ESLint 9 (`eslint.config.mjs`) dengan `eslint-config-next` versi 16.2.10 (`core-web-vitals` dan `typescript`).

---

## 8. Daftar Rute Aktual di `app/`

| Rute | File Sumber | Jenis |
| :--- | :--- | :--- |
| `/` | `app/page.tsx` | Static Page (○) |
| `/checkout` | `app/checkout/page.tsx` | Static Page (○) |
| `/invoice/[token]` | `app/invoice/[token]/page.tsx` | Dynamic Page (ƒ) |
| `/api/payments/create` | `app/api/payments/create/route.ts` | Dynamic API Route (ƒ) |
| `/api/payments/status` | `app/api/payments/status/route.ts` | Dynamic API Route (ƒ) |
| `/api/payments/webhook` | `app/api/payments/webhook/route.ts` | Dynamic API Route (ƒ) |
| `/robots.txt` | `app/robots.ts` | Static Route (○) |
| `/sitemap.xml` | `app/sitemap.ts` | Static Route (○) |

### Daftar Reserved Slugs (Harus Ditolak Sistem pada Validasi Slug):
`admin`, `api`, `checkout`, `invoice`, `login`, `logout`, `robots`, `sitemap`, `_next`, `favicon`, `static`, `public`, `masalah`, `solusi`, `portofolio`, `penawaran`.

---

## 9. Baseline Verifikasi Kode Saat Ini

| Perintah | Hasil | Keterangan |
| :--- | :--- | :--- |
| `npm run typecheck` | **PASS (Exit 0)** | Tidak ada error type TypeScript. |
| `npm run lint` | **PASS (Exit 0)** | ESLint 9 lolos tanpa warning/error. |
| `npm run build` (Turbopack) | **FAIL (Exit 1)** | Terjadi `TurbopackInternalError` pada PostCSS subprocess di Windows sandbox (`node process exited before we could connect to it with exit code: 0`). |
| `npx next build --webpack` | **PASS (Exit 0)** | Build berhasil 100% saat menggunakan engine webpack standar. |

---

## 10. Checklist Verifikasi Fase 0 (Roadmap Selesai)
- [x] `docs/audit.md` ada dan daftar titik nomor WhatsApp lengkap (dicocokkan dengan PRD & kode aktual).
- [x] Baseline typecheck/lint/build tercatat.
- [x] Branch `feat/user-pages` aktif.
- [x] Database migrasi awal (`site_users` & `admins`) telah tersinkronisasi di Supabase remote.
