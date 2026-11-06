import type { Metadata } from "next";
import { ContactProvider } from "@/components/contact-provider";
import { DemoShowcase } from "@/components/demo-showcase";
import { siteConfig } from "@/lib/site-config";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Koleksi Demo Landing Page Statis (Rp200.000) — NALARA",
  description:
    "Pilihan contoh desain website & landing page statis siap pakai seharga Rp200.000 dari NALARA. Cepat, modern, responsif, dan siap online.",
  alternates: {
    canonical: `${siteUrl}/demo`,
  },
  openGraph: {
    title: "Koleksi Demo Landing Page Statis (Rp200.000) — NALARA",
    description:
      "Pilihan contoh template landing page statis siap pakai seharga Rp200.000 dari NALARA. Pengerjaan kilat 1-2 hari kerja.",
    url: `${siteUrl}/demo`,
    siteName: siteConfig.name,
    locale: "id_ID",
    type: "website",
  },
};

export default function DemoPage() {
  return (
    <ContactProvider whatsappNumber={siteConfig.whatsappNumber}>
      <DemoShowcase />
    </ContactProvider>
  );
}
