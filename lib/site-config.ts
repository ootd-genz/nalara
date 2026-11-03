import { beginnerPackage, businessPackage, formatRupiah, starterPackage } from "@/lib/commerce";

export const siteConfig = {
  name: "NALARA",
  tagline: "Solusi digital dengan nalar dan arah yang jelas.",
  whatsappNumber: "6283829198193",
  instagramHandle: "nalara.website",
  offerPrice: formatRupiah(starterPackage.price),
  regularPrice: formatRupiah(starterPackage.regularPrice),
};

const whatsappMessage = encodeURIComponent(
  "Halo NALARA, saya ingin konsultasi paket pembuatan website untuk bisnis saya. Nama bisnis: ... Jenis produk/jasa: ... Paket yang diminati: ..."
);

export const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessage}`;

export const beginnerWhatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  `Halo NALARA, saya tertarik pesan Paket Beginner (${formatRupiah(beginnerPackage.price)}). Nama bisnis: ... Jenis produk/jasa: ... Catatan kebutuhan: ...`
)}`;

export const starterWhatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  `Halo NALARA, saya tertarik pesan Paket Starter (${formatRupiah(starterPackage.price)} - Paling Banyak Dipesan). Nama bisnis: ... Jenis produk/jasa: ... Pilihan domain yang diinginkan: ...`
)}`;

export const businessWhatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
  `Halo NALARA, saya tertarik pesan Paket Business (${formatRupiah(businessPackage.price)}). Nama bisnis: ... Jumlah halaman yang direncanakan: ... Jenis produk/jasa: ...`
)}`;

// Aliases for compatibility
export const catalogWhatsappUrl = starterWhatsappUrl;
export const onlineStoreWhatsappUrl = businessWhatsappUrl;

export const instagramUrl = `https://instagram.com/${siteConfig.instagramHandle}`;
