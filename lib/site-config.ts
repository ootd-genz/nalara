import { beginnerPackage, businessPackage, formatRupiah, starterPackage } from "@/lib/commerce";

export const siteConfig = {
  name: "NALARA",
  tagline: "Solusi digital dengan nalar dan arah yang jelas.",
  whatsappNumber: "6289517795206",
  instagramHandle: "nalara.website",
  offerPrice: formatRupiah(starterPackage.price),
  regularPrice: formatRupiah(starterPackage.regularPrice),
};

export function getWhatsAppUrl(number: string, message?: string): string {
  if (!message) {
    return `https://wa.me/${number}`;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const defaultWhatsAppMessage =
  "Halo NALARA, saya ingin konsultasi paket pembuatan website untuk bisnis saya. Nama bisnis: ... Jenis produk/jasa: ... Paket yang diminati: ...";

export const getBeginnerWhatsAppMessage = () =>
  `Halo NALARA, saya tertarik pesan Paket Beginner (${formatRupiah(beginnerPackage.price)}). Nama bisnis: ... Jenis produk/jasa: ... Catatan kebutuhan: ...`;

export const getStarterWhatsAppMessage = () =>
  `Halo NALARA, saya tertarik pesan Paket Starter (${formatRupiah(starterPackage.price)} - Paling Banyak Dipesan). Nama bisnis: ... Jenis produk/jasa: ... Pilihan domain yang diinginkan: ...`;

export const getBusinessWhatsAppMessage = () =>
  `Halo NALARA, saya tertarik pesan Paket Business (${formatRupiah(businessPackage.price)}). Nama bisnis: ... Jumlah halaman yang direncanakan: ... Jenis produk/jasa: ...`;

export const getConsultationWhatsAppUrl = (number: string = siteConfig.whatsappNumber) =>
  getWhatsAppUrl(number, defaultWhatsAppMessage);

export const getBeginnerWhatsAppUrl = (number: string = siteConfig.whatsappNumber) =>
  getWhatsAppUrl(number, getBeginnerWhatsAppMessage());

export const getStarterWhatsAppUrl = (number: string = siteConfig.whatsappNumber) =>
  getWhatsAppUrl(number, getStarterWhatsAppMessage());

export const getBusinessWhatsAppUrl = (number: string = siteConfig.whatsappNumber) =>
  getWhatsAppUrl(number, getBusinessWhatsAppMessage());

// Backward-compatible exports with default number
export const whatsappUrl = getConsultationWhatsAppUrl(siteConfig.whatsappNumber);
export const beginnerWhatsappUrl = getBeginnerWhatsAppUrl(siteConfig.whatsappNumber);
export const starterWhatsappUrl = getStarterWhatsAppUrl(siteConfig.whatsappNumber);
export const businessWhatsappUrl = getBusinessWhatsAppUrl(siteConfig.whatsappNumber);

// Aliases for compatibility
export const catalogWhatsappUrl = starterWhatsappUrl;
export const onlineStoreWhatsappUrl = businessWhatsappUrl;

export const instagramUrl = `https://instagram.com/${siteConfig.instagramHandle}`;
