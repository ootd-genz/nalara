import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "NALARA — Jasa Pembuatan Website & Landing Page Profesional",
  description: "Jasa pembuatan website landing page dan website bisnis mulai dari paket Beginner, Starter (Paling Banyak Dipesan), hingga Business. Desain responsif, domain .com & email bisnis.",
  keywords: [
    "jasa pembuatan website",
    "jasa landing page",
    "website UMKM",
    "landing page profesional",
    "jasa bikin website murah",
    "NALARA website",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "NALARA — Jasa Pembuatan Website & Landing Page Profesional",
    description: "Pilihan paket website Beginner, Starter (Rp1.200.000), dan Business (Rp1.900.000) dengan domain .com dan garansi maintenance.",
    url: "/",
    siteName: "NALARA",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/og-nalara.png", width: 1200, height: 630, alt: "NALARA jasa pembuatan website profesional" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NALARA — Jasa Pembuatan Website & Landing Page Profesional",
    description: "Pilihan paket website Beginner, Starter, dan Business dengan domain .com dan garansi maintenance.",
    images: ["/og-nalara.png"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B0E0C", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
