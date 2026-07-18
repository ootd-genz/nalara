import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "NALARA — Jasa Website Katalog & Toko Online untuk UMKM",
  description: "Website katalog produk mulai Rp69.000 dan toko online dengan sistem pembayaran mulai Rp599.000 untuk UMKM dan personal brand.",
  keywords: ["jasa pembuatan website", "website UMKM", "website e-commerce", "jasa website murah", "NALARA website"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "NALARA — Website Katalog & Toko Online untuk Bisnis Anda",
    description: "Website katalog produk Rp69.000 atau toko online dengan sistem pembayaran Rp599.000.",
    url: "/",
    siteName: "NALARA",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/og-nalara.png", width: 1200, height: 630, alt: "NALARA website katalog dan toko online" }],
  },
  twitter: { card: "summary_large_image", title: "NALARA — Website Katalog & Toko Online", description: "Paket website untuk mengarahkan pesanan ke WhatsApp, marketplace, atau pembayaran online.", images: ["/og-nalara.png"] },
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
