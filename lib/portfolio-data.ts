export type PortfolioCategory = "all" | "ecommerce" | "profile" | "webapp";

export type PortfolioItem = {
  id: string;
  title: string;
  headline: string;
  description: string;
  url: string;
  domain: string;
  category: "ecommerce" | "profile" | "webapp";
  categoryLabel: string;
  tags: string[];
  isFeatured?: boolean;
};

export const portfolioCategories: { key: PortfolioCategory; label: string }[] = [
  { key: "all", label: "Semua Proyek" },
  { key: "ecommerce", label: "Bisnis & E-Commerce" },
  { key: "profile", label: "Profil & Lembaga" },
  { key: "webapp", label: "Sistem & Web App" },
];

export const portfolioProjects: PortfolioItem[] = [
  {
    id: "sdit-fajar",
    title: "SDIT Fajar — PPDB Online",
    headline: "Sistem Pendaftaran Murid Baru & Portal Sekolah",
    description:
      "Aplikasi web pendaftaran siswa baru terpadu dengan formulir registrasi digital, verifikasi berkas online, dan informasi akademik transparan bagi wali murid.",
    url: "https://sditfajar.sch.id",
    domain: "sditfajar.sch.id",
    category: "webapp",
    categoryLabel: "Portal Edukasi",
    tags: ["PPDB Online", "Domain Resmi .sch.id", "Formulir Digital", "Verifikasi Berkas"],
    isFeatured: true,
  },
  {
    id: "nusamart",
    title: "NusaMart — E-Commerce",
    headline: "Toko Online Katalog WhatsApp & Multi-Channel",
    description:
      "Website katalog produk e-commerce dengan navigasi produk responsif, pencarian cepat, integrasi pemesanan instan ke WhatsApp, dan tautan afiliasi belanja.",
    url: "https://www.azzamazhari.web.id/",
    domain: "azzamazhari.web.id",
    category: "ecommerce",
    categoryLabel: "E-Commerce",
    tags: ["WhatsApp Checkout", "Katalog Produk", "Link Affiliate", "Pencarian Cepat"],
    isFeatured: true,
  },
  {
    id: "kasir-cafe",
    title: "POS Cafe & Kitchen Display",
    headline: "Sistem Kasir & Sinkronisasi Dapur Resto/Cafe",
    description:
      "Aplikasi Point of Sale (POS) cerdas untuk operasional resto dan cafe. Menghubungkan kasir depan dengan layar dapur secara real-time untuk efisiensi antrean pesanan.",
    url: "https://kasircafe.vercel.app/",
    domain: "kasircafe.vercel.app",
    category: "webapp",
    categoryLabel: "Aplikasi POS & F&B",
    tags: ["Kitchen Display", "Point of Sale", "Sinkronisasi Real-Time", "Kelola Menu"],
    isFeatured: true,
  },
  {
    id: "nalara-delta",
    title: "Nalara — High-Converting Landing Page",
    headline: "Landing Page Penjualan E-Commerce Berkonversi",
    description:
      "Halaman penawaran produk yang dioptimasi untuk rasio konversi tinggi dengan copywriting persuasif AIDA, countdown promo terbatas, dan pemesanan WhatsApp kilat.",
    url: "https://nalara-delta.vercel.app/",
    domain: "nalara-delta.vercel.app",
    category: "ecommerce",
    categoryLabel: "Landing Page",
    tags: ["Conversion Focused", "Countdown Promo", "Copywriting Persuasif", "Ultra Fast"],
  },
  {
    id: "frasa-klausa",
    title: "Frasa Klausa Media",
    headline: "Portal Berita & Publikasi Kreatif Independen",
    description:
      "Media berita digital modern dengan desain antarmuka baca yang bersih, tipografi editorial elegan, struktur SEO ramah Google News, dan kategori dinamis.",
    url: "https://www.frasaklausamedia.com/",
    domain: "frasaklausamedia.com",
    category: "profile",
    categoryLabel: "Media & Berita",
    tags: ["Portal Berita", "Domain .com", "SEO Friendly", "Editorial Layout"],
  },
  {
    id: "bmh-company-profile",
    title: "BMH — Company Profile",
    headline: "Profil Korporat & Kredibilitas Lembaga Sosial",
    description:
      "Website profil institusi resmi yang menyajikan legalitas, visi misi, portofolio program pemberdayaan, transparansi laporan, dan jalur komunikasi publik.",
    url: "https://bmh-one.vercel.app/",
    domain: "bmh-one.vercel.app",
    category: "profile",
    categoryLabel: "Company Profile",
    tags: ["Corporate Identity", "Laporan Transparan", "Legalitas Resmi", "Mobile Optimized"],
  },
  {
    id: "riswandi-wedding",
    title: "Riswandi Wedding Booking",
    headline: "Reservasi Pernikahan & Undangan Digital Modern",
    description:
      "Platform booking dan undangan pernikahan eksklusif dengan konfirmasi kehadiran tamu (RSVP), galeri foto memikat, rundown acara, dan navigasi lokasi peta.",
    url: "https://riswandi-wedding.vercel.app/",
    domain: "riswandi-wedding.vercel.app",
    category: "profile",
    categoryLabel: "Wedding & Event",
    tags: ["RSVP Digital", "Galeri Foto", "Google Maps", "Undangan Eksklusif"],
  },
  {
    id: "karta-tuju",
    title: "Karang Taruna Karta Tuju",
    headline: "Website Profil Komunitas & Organisasi Pemuda",
    description:
      "Pusat informasi dan dokumentasi kegiatan organisasi pemuda. Menyajikan transparansi program kerja, agenda bakti sosial, dan profil pengurus komunitas.",
    url: "https://kartatuju.vercel.app/",
    domain: "kartatuju.vercel.app",
    category: "profile",
    categoryLabel: "Organisasi",
    tags: ["Profil Komunitas", "Agenda Kerja", "Dokumentasi Galeri", "Transparansi"],
  },
  {
    id: "resepsionis-bmh",
    title: "Resepsionis & Buku Tamu BMH",
    headline: "Sistem Registrasi Kunjungan Kantor Paperless",
    description:
      "Aplikasi buku tamu digital modern untuk instansi dan perkantoran. Mencatat identitas tamu, instansi asal, tujuan pertemuan, serta log histori kedatangan rapi.",
    url: "https://resepsionis-bmh-apps.vercel.app/",
    domain: "resepsionis-bmh-apps.vercel.app",
    category: "webapp",
    categoryLabel: "Sistem Kantor",
    tags: ["Paperless", "Log Kunjungan", "Buku Tamu Digital", "Histori Real-Time"],
  },
  {
    id: "lms-guru-pjok",
    title: "LMS Penilaian Siswa PJOK",
    headline: "Platform Rekap & Evaluasi Akademik Guru SD",
    description:
      "Sistem evaluasi akademik khusus tenaga pendidik untuk menginput nilai fisik dan teori siswa, memonitor capaian kompetensi, dan mencetak laporan otomatis.",
    url: "https://lms-guru-pjok.vercel.app/",
    domain: "lms-guru-pjok.vercel.app",
    category: "webapp",
    categoryLabel: "Sistem Akademik",
    tags: ["Input Nilai Cepat", "Rekap Otomatis", "Evaluasi Capaian", "Kemudahan Guru"],
  },
  {
    id: "monitoring-dept",
    title: "Monitoring Departemen",
    headline: "Dashboard Pantau Kinerja & Status Tim",
    description:
      "Dashboard manajerial terpusat untuk memantau progres operasional divisi, alur kerja departemen, dan capaian target tim dalam visualisasi data yang lugas.",
    url: "https://monitoring-department.vercel.app/",
    domain: "monitoring-department.vercel.app",
    category: "webapp",
    categoryLabel: "Dashboard Kinerja",
    tags: ["Visual Progress", "Status Tugas", "Tracking Operasional", "Manajemen Tim"],
  },
  {
    id: "umkm-merchant",
    title: "Merchant Platform UMKM",
    headline: "Dashboard Penjualan & Rekap Transaksi Bisnis",
    description:
      "Panel monitoring bisnis untuk pelaku UMKM dalam mencatat transaksi masuk, menganalisis grafik penjualan harian, dan memantau perkembangan omzet usaha.",
    url: "https://linkaja-merchant-platform.vercel.app/penjualan",
    domain: "linkaja-merchant-platform.vercel.app",
    category: "ecommerce",
    categoryLabel: "Dashboard UMKM",
    tags: ["Rekap Penjualan", "Monitoring Omzet", "QRIS & Digital", "Analisis Harian"],
  },
  {
    id: "travel-website",
    title: "Travel & Tour Website",
    headline: "Eksplorasi Paket Liburan & Reservasi Perjalanan",
    description:
      "Website agensi wisata interaktif dengan etalase destinasi impian, detail rute tur lengkap, estimasi biaya transparan, dan pemesanan tiket perjalanan via WhatsApp.",
    url: "https://travel-website-delta-ashen.vercel.app/",
    domain: "travel-website-delta-ashen.vercel.app",
    category: "ecommerce",
    categoryLabel: "Travel & Wisata",
    tags: ["Katalog Destinasi", "Jadwal Tur", "Estimasi Biaya", "Booking WhatsApp"],
  },
];

