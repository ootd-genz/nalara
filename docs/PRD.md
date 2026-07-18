# Product Requirements — NALARA

## Ringkasan

Website penawaran paket Website Katalog Produk dan Website Toko Online untuk UMKM dan personal brand, dengan checkout Midtrans QRIS, invoice online, serta konsultasi melalui WhatsApp.

## Konversi

- CTA pembelian membuka `/checkout`.
- CTA konsultasi tetap menuju WhatsApp NALARA.
- Instagram membuka `@nalara.website`.
- Setelah pembayaran terverifikasi, invoice ditampilkan, dikirim melalui WhatsApp Cloud API, lalu pengguna diarahkan ke chat NALARA.

## Persyaratan pembayaran

- Harga resmi ditentukan server berdasarkan ID paket, bukan input browser.
- Metode utama adalah Midtrans Snap `other_qris`.
- Server memverifikasi signature, status, order ID, dan gross amount.
- Satu webhook serverless menangani seluruh status pembayaran Midtrans.
- Pengiriman template WhatsApp harus idempoten.
- Invoice dapat dipulihkan menggunakan token publik acak dan dapat dicetak.

## Detail penawaran

- Harga promo: Rp69.000.
- Harga reguler paket katalog yang ditampilkan: Rp150.000.
- Paket toko online ditampilkan seharga Rp599.000 dari Rp1.000.000.
- Tampilan responsif, basic SEO, maksimal 10 produk, satu revisi ringan, dan panduan publikasi dasar.
- Domain, hosting berbayar, dashboard admin client, dan fitur custom berada di luar harga paket.

## Acceptance criteria

- `npm run check` berhasil.
- Landing page, checkout, dan invoice responsif.
- Semua CTA pembelian menuju checkout.
- Nominal frontend, database, dan Midtrans selalu Rp69.000.
- QRIS dapat dilanjutkan jika popup tertutup.
- Status paid memunculkan invoice dan pengalihan WhatsApp.
- Notifikasi webhook duplikat tidak menggandakan pesan WhatsApp.
