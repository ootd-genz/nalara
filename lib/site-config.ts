import { formatRupiah, starterPackage } from "@/lib/commerce";

export const siteConfig = {
  name: "NALARA",
  tagline: "Solusi digital dengan nalar dan arah yang jelas.",
  whatsappNumber: "6282261060675",
  instagramHandle: "nalara.website",
  offerPrice: formatRupiah(starterPackage.price),
  regularPrice: formatRupiah(starterPackage.regularPrice),
};
const whatsappMessage = encodeURIComponent(
  "Halo NALARA, saya ingin konsultasi paket website untuk bisnis saya. Nama bisnis: ... Jenis produk: ... Paket yang diminati: ..."
);
export const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessage}`;
export const catalogWhatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  "Halo NALARA, saya tertarik Website Katalog Produk Rp69.000 (harga normal Rp150.000). Nama bisnis: ... Jenis produk: ..."
)}`;
export const onlineStoreWhatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  "Halo NALARA, saya tertarik Website Toko Online Rp599.000 (harga normal Rp1.000.000). Nama bisnis: ... Jenis produk: ... Metode pembayaran yang dibutuhkan: ..."
)}`;
export const instagramUrl = `https://instagram.com/${siteConfig.instagramHandle}`;
