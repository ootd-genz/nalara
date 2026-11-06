export type DemoCategory =
  | "all"
  | "portfolio"
  | "corporate"
  | "saas"
  | "creative";

export interface DemoTemplate {
  id: string;
  name: string;
  title: string;
  category: DemoCategory;
  categoryLabel: string;
  description: string;
  demoUrl: string;
  tags: string[];
  targetAudience: string;
  isPopular?: boolean;
}

export const demoCategories: { key: DemoCategory; label: string }[] = [
  { key: "all", label: "Semua Template" },
  { key: "portfolio", label: "Portofolio & Personal" },
  { key: "corporate", label: "Bisnis & Corporate" },
  { key: "saas", label: "SaaS & App" },
  { key: "creative", label: "Kreatif & Editorial" },
];

export const demoTemplates: DemoTemplate[] = [
  {
    id: "dashboard-finexy",
    name: "Finexy FinTech Dashboard",
    title: "Finexy — FinTech Dashboard",
    category: "saas",
    categoryLabel: "SaaS & Dashboard",
    description: "Tampilan dashboard modern untuk analitik keuangan, ringkasan transaksi, dan manajemen akun bisnis.",
    demoUrl: "/demos/dashboard-finexy.html",
    tags: ["FinTech", "Dashboard", "Analytics", "Dark Theme"],
    targetAudience: "Aplikasi Web, Startup FinTech, Portal Data Bisnis",
    isPopular: true,
  },
  {
    id: "fashion",
    name: "Luxury Travel & Fashion Editorial",
    title: "Codecuy — Luxury Travel, Weddings & Exclusive Stays",
    category: "creative",
    categoryLabel: "Luxury & Editorial",
    description: "Landing page bergaya majalah editorial mewah untuk industri travel, resort, vila eksklusif, dan fashion brand.",
    demoUrl: "/demos/fashion.html",
    tags: ["Luxury", "Editorial", "Resort & Travel", "Eksklusif"],
    targetAudience: "Vila/Resort, Fashion Brand, Wedding Organizer",
    isPopular: true,
  },
  {
    id: "glass",
    name: "Modern Glassmorphism Showcase",
    title: "Codecuy — Frontend Developer Showcase",
    category: "portfolio",
    categoryLabel: "Glassmorphism UI",
    description: "Desain futuristik dengan aksen frosted glass, animasi gradien lembut, dan kartu interaktif elegan.",
    demoUrl: "/demos/glass.html",
    tags: ["Glassmorphism", "Futuristik", "Glow Accent", "Portofolio"],
    targetAudience: "Personal Branding, Developer, Desainer Kreatif",
  },
  {
    id: "macos-liquid-glass",
    name: "macOS Liquid Glass Software Page",
    title: "Codecuy — Bring Ring Cameras to Your Mac",
    category: "saas",
    categoryLabel: "Desktop & App",
    description: "Halaman landing page bergaya ekosistem macOS dengan visual jendela liquid glass premium khas aplikasi desktop.",
    demoUrl: "/demos/macos-liquid-glass.html",
    tags: ["macOS Style", "Software Showcase", "Clean UI", "Minimalist"],
    targetAudience: "Aplikasi Desktop, Software Tool, Produk Digital",
  },
  {
    id: "modern-professional",
    name: "Modern Professional Architecture",
    title: "Codecuy | Premium Architecture & Design",
    category: "corporate",
    categoryLabel: "Corporate & Arsitektur",
    description: "Tata letak prestisius untuk biro arsitektur, konsultan properti, studio interior, dan profil perusahaan korporat.",
    demoUrl: "/demos/modern-professional.html",
    tags: ["Arsitektur", "Properti", "Minimalis", "Corporate"],
    targetAudience: "Kontraktor, Arsitek, Properti, Kantor Konsultan",
    isPopular: true,
  },
  {
    id: "neubrutalist",
    name: "Neubrutalist Creative Marketplace",
    title: "Codecuy — Neubrutalist NFT & Creative Marketplace",
    category: "creative",
    categoryLabel: "Neubrutalism & Web3",
    description: "Gaya neubrutalisme berani dengan garis tebal, warna kontras tinggi, dan elemen visual retro yang sangat menarik perhatian.",
    demoUrl: "/demos/neubrutalist.html",
    tags: ["Neubrutalism", "Bold Typography", "Trendy", "Marketplace"],
    targetAudience: "Digital Agency, Komunitas Kreatif, Brand Gen-Z",
  },
  {
    id: "openable",
    name: "Openable AI Apps Platform",
    title: "Codecuy — Run AI-Generated Apps Without Hassle",
    category: "saas",
    categoryLabel: "AI & Platform",
    description: "Landing page modern untuk produk berbasis AI dan otomasi dengan sorotan fitur interaktif berkonversi tinggi.",
    demoUrl: "/demos/openable.html",
    tags: ["AI Platform", "SaaS Modern", "Conversion Focused", "High Tech"],
    targetAudience: "Startup AI, Tool Digital, Platform Layanan",
  },
  {
    id: "pixel-studio",
    name: "Pixel Studio Digital Partner",
    title: "Codecuy — Design Partner Who Ships, Concept to Code",
    category: "creative",
    categoryLabel: "Studio & Agency",
    description: "Showcase dinamis untuk studio kreatif, agensi pemasaran digital, dan rumah produksi konten visual.",
    demoUrl: "/demos/pixel-studio.html",
    tags: ["Studio Kreatif", "Agensi Digital", "Portfolio Grid", "Bold"],
    targetAudience: "Agensi Digital, Rumah Produksi, Studio Kreatif",
  },
  {
    id: "playful",
    name: "EdTech & Student App Showcase",
    title: "EdTech Student App Showcase",
    category: "saas",
    categoryLabel: "EdTech & Mobile",
    description: "Desain ceria dan ramah pengguna untuk promosi aplikasi mobile, bimbingan belajar, dan platform edukasi interaktif.",
    demoUrl: "/demos/playful.html",
    tags: ["Playful", "EdTech", "Mobile App Showcase", "Ramah Anak"],
    targetAudience: "Aplikasi Edukasi, Kursus Online, Komunitas Anak Muda",
  },
  {
    id: "portfolio",
    name: "Codecuy Minimalist Portfolio",
    title: "Codecuy | Creative Portfolio Showcase",
    category: "portfolio",
    categoryLabel: "Portofolio Kreatif",
    description: "Portofolio profesional dengan showcase proyek grid masonry responsif dan tipografi yang tajam.",
    demoUrl: "/demos/portfolio.html",
    tags: ["Portofolio", "Masonry Grid", "Minimalist", "Developer/Designer"],
    targetAudience: "Freelancer, Fotografer, Kreator Konten, Developer",
  },
];
