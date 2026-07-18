# Deployment

Website sekarang memakai Next.js hybrid karena checkout dan webhook harus berjalan di server. Gunakan hosting yang mendukung Next.js serverless, seperti Vercel atau Netlify Next Runtime; jangan mengunggah folder `out/` ke hosting statis.

## Pemeriksaan lokal

```bash
npm install
npm run check
```

## Konfigurasi production

Untuk kondisi saat ini, seluruh pemesanan diarahkan ke WhatsApp dan integrasi Midtrans dinonaktifkan sementara. Variabel Midtrans pada `.env.local` dan `.env.example` sengaja dikomentari. Jangan menambahkan variabel Midtrans ke Vercel sebelum checkout QRIS diaktifkan kembali.

Variabel yang disarankan untuk landing page saat ini:

- `NEXT_PUBLIC_SITE_URL` — URL production lengkap, misalnya `https://domainanda.com`, agar canonical URL dan metadata memakai domain yang benar.

Variabel Supabase dan WhatsApp Cloud API hanya diperlukan untuk invoice serta otomatisasi pembayaran lama. Landing page dan tombol WhatsApp tetap berjalan tanpa variabel tersebut.

### Saat pembayaran diaktifkan kembali

Salin seluruh key dari `.env.example` ke environment hosting. Nilai yang wajib tersedia:

- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`
- `MIDTRANS_SERVER_KEY` dan `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION` dan `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION`
- `WHATSAPP_PHONE_NUMBER_ID` dan `WHATSAPP_ACCESS_TOKEN`
- Konfigurasi template WhatsApp

Jangan pernah memberi prefix `NEXT_PUBLIC_` pada Server Key Midtrans, Supabase Service Role Key, atau WhatsApp Access Token.

## Perintah deployment

- Build command: `npm run build`
- Install command: `npm install`
- Framework preset: Next.js
- Node.js: 20.x

Ikuti [PAYMENTS_SETUP.md](./PAYMENTS_SETUP.md) sebelum mengaktifkan pembayaran production.
