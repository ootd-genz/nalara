export const staticLandingPackage = {
  id: "website-static-landing",
  name: "Landing Page Statis",
  subtitle: "Template Siap Pakai",
  description: "Landing page statis cepat saji hemat biaya. Pilih dari 10+ template modern yang telah kami siapkan.",
  price: 200_000,
  regularPrice: 350_000,
  currency: "IDR",
  badge: "Paling Hemat",
  features: [
    "Pilihan 10+ Template HTML Modern (Cek Demo)",
    "1 Halaman Landing Page Statis Ringan & Cepat",
    "Desain Responsif (Mobile & Desktop)",
    "Integrasi Tombol WhatsApp & Media Sosial",
    "Gratis File Source Code Lengkap (.html & assets)",
    "Pengerjaan Kilat 1-2 Hari Kerja",
  ],
} as const;

export const beginnerPackage = {
  id: "website-beginner",
  name: "Beginner",
  subtitle: "Landing page & website statis",
  description: "Website statis & landing page simpel untuk profil usaha, promosi produk/jasa, atau personal branding.",
  price: 650_000,
  regularPrice: 850_000,
  currency: "IDR",
  features: [
    "1 Halaman Ringkas (Landing Page Sederhana)",
    "Desain Responsif (Mobile & Desktop)",
    "Setup Hosting Standar / Subdomain Siap Pakai",
    "Integrasi Tombol WhatsApp & Media Sosial",
    "SEO Dasar (Optimasi Mesin Pencari)",
    "Gratis SSL (Keamanan Standar)",
    "Revisi Gratis 1x",
    "Garansi Maintenance 7 hari",
  ],
} as const;

export const starterPackage = {
  id: "website-starter",
  name: "Starter",
  subtitle: "Paling Banyak Dipesan",
  description: "Landing page panjang berkonversi tinggi dengan domain .com gratis dan email bisnis profesional.",
  price: 1_200_000,
  regularPrice: 1_400_000,
  currency: "IDR",
  badge: "Paling Banyak Dipesan",
  isPopular: true,
  features: [
    "1 Halaman Panjang (Landing Page)",
    "Desain Responsif (Mobile & Desktop)",
    "SEO Dasar (Optimasi Mesin Pencari)",
    "Gratis Domain (.com)",
    "Hosting 1 Tahun",
    "1 Email Bisnis (xxx@bisnis.com)",
    "1 GB Penyimpanan",
    "Gratis SSL (Keamanan Standar)",
    "Revisi Gratis 2x",
    "Garansi Maintenance 15 hari",
  ],
} as const;

export const businessPackage = {
  id: "website-business",
  name: "Business",
  subtitle: "Multi-halaman skala bisnis",
  description: "Hingga 5 halaman website lengkap dengan SEO dasar dan resource penyimpanan lebih besar.",
  price: 1_900_000,
  regularPrice: 2_000_000,
  currency: "IDR",
  features: [
    "Hingga 5 Halaman Website",
    "Desain Responsif (Mobile & Desktop)",
    "Gratis Domain (.com)",
    "Hosting 1 tahun",
    "2 Email Bisnis (xxx@bisnis.com)",
    "10 GB Penyimpanan",
    "Gratis SSL (Keamanan Standar)",
    "SEO Dasar (Optimasi Mesin Pencari)",
    "Revisi Gratis 5x",
    "Garansi Maintenance 30 hari",
  ],
} as const;

export const allPackages = [staticLandingPackage, beginnerPackage, starterPackage, businessPackage] as const;

export function formatRupiah(amount: number) {
  return `Rp${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(amount)}`;
}

export function getPackageById(packageId: unknown) {
  if (packageId === staticLandingPackage.id) return staticLandingPackage;
  if (packageId === beginnerPackage.id) return beginnerPackage;
  if (packageId === starterPackage.id) return starterPackage;
  if (packageId === businessPackage.id) return businessPackage;
  return null;
}
