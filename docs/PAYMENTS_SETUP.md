# Setup Midtrans, QRIS, dan WhatsApp Cloud API

Integrasi ini memakai satu webhook serverless untuk notifikasi Midtrans:

```text
https://domain-anda.com/api/payments/webhook
```

Harga paket tidak diterima dari browser. Endpoint server membaca ID paket dan menetapkan nominal resmi Rp69.000 dari `lib/commerce.ts`.

## 1. Siapkan tabel order

Jalankan migration berikut melalui Supabase SQL Editor atau workflow migration Anda:

```text
supabase/migrations/202607170001_payment_orders.sql
```

Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` di environment server. Tabel mengaktifkan RLS dan tidak mempunyai akses publik; frontend hanya berkomunikasi dengan route server.

## 2. Aktifkan Midtrans Sandbox

1. Ambil Server Key dan Client Key dari Midtrans Sandbox Dashboard.
2. Pastikan GoPay atau ShopeePay QRIS aktif, kemudian aktifkan `Other QRIS` pada Snap Preferences.
3. Set Payment Notification URL ke endpoint webhook di atas.
4. Isi environment:

```env
MIDTRANS_SERVER_KEY=SB-Mid-server-...
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-...
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

Webhook memverifikasi `signature_key`, mengambil ulang status transaksi dari API Midtrans, mencocokkan order ID dan nominal, lalu memproses status secara idempoten.

## 3. Buat template WhatsApp

Buat template utility bernama `nalara_invoice_paid` dengan bahasa Indonesia. Body template menggunakan lima variabel dalam urutan berikut:

```text
Halo {{1}}, pembayaran Anda berhasil.

Invoice: {{2}}
Paket: {{3}}
Total: {{4}}

Lihat invoice dan lanjutkan pesanan: {{5}}
```

Setelah template disetujui, isi:

```env
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_GRAPH_API_VERSION=v23.0
WHATSAPP_TEMPLATE_NAME=nalara_invoice_paid
WHATSAPP_TEMPLATE_LANGUAGE=id
```

Gunakan permanent system-user access token untuk production, simpan hanya sebagai secret di hosting, dan jangan memasukkannya ke source code.

## 4. Uji alur Sandbox

1. Buka `/checkout` dan isi data pemesan.
2. Pastikan total yang tampil Rp69.000.
3. Bayar melalui simulator Midtrans Sandbox.
4. Pastikan `/invoice/{token}` berubah menjadi `paid`.
5. Pastikan invoice terkirim melalui WhatsApp dan halaman membuka chat NALARA.
6. Kirim ulang notifikasi dari Midtrans Dashboard dan pastikan WhatsApp tidak dikirim dua kali.

## 5. Pindah ke production

Ganti kedua key Midtrans dengan key production, ubah kedua flag production menjadi `true`, aktifkan QRIS pada akun merchant production, dan daftarkan URL webhook HTTPS production. Jangan mencampur Client Key Sandbox dengan Server Key production.
