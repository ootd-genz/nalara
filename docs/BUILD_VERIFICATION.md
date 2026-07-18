# Build Verification

Pemeriksaan yang telah dijalankan pada paket ini:

- `npm run lint` — berhasil tanpa error atau warning.
- `npm run typecheck` — berhasil tanpa error TypeScript.
- `npm run build` — berhasil menghasilkan halaman statis dan route serverless pembayaran.

Kontak yang diverifikasi dalam hasil build:

- WhatsApp: `6282261060675`
- Instagram: `nalara.website`
- Harga promo: `Rp69.000`
- Harga reguler paket katalog: `Rp150.000`
- Harga paket toko online: `Rp599.000` dari `Rp1.000.000`

Route checkout yang diverifikasi saat build:

- `/checkout` — halaman checkout.
- `/invoice/[token]` — invoice dan status pembayaran.
- `/api/payments/create` — membuat transaksi dengan harga server-side.
- `/api/payments/status` — memverifikasi status ke Midtrans.
- `/api/payments/webhook` — satu webhook notifikasi Midtrans dan WhatsApp.
