# NALARA Landing Page

Website NALARA dengan landing page responsif, checkout Midtrans QRIS, invoice online, satu webhook pembayaran serverless, dan konfirmasi WhatsApp Cloud API.

## Stack

- Next.js App Router dan TypeScript
- Tailwind CSS
- Midtrans Snap dengan `Other QRIS`
- Supabase sebagai penyimpanan order server-side
- WhatsApp Cloud API untuk template invoice

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Salin `.env.example` menjadi `.env.local` dan isi kredensial Sandbox sebelum mencoba checkout.

## Validasi

```bash
npm run check
```

Konfigurasi pembayaran lengkap ada di `docs/PAYMENTS_SETUP.md`, sedangkan petunjuk hosting ada di `docs/DEPLOYMENT.md`.
