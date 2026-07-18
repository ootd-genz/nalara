import type { Metadata } from "next";
import { BrandLogo } from "@/components/brand-logo";
import { InvoiceStatus } from "@/components/checkout/invoice-status";

export const metadata: Metadata = {
  title: "Invoice Pembayaran",
  description: "Periksa status pembayaran dan invoice layanan NALARA.",
  robots: { index: false, follow: false },
};

export default async function InvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="min-h-screen pb-16">
      <header className="no-print border-b border-white/8 bg-[#0b0e0c]/90 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-5"><BrandLogo href="/" ariaLabel="Kembali ke halaman utama" /><p className="text-xs font-semibold text-[var(--muted-foreground)]">Pembayaran aman via Midtrans</p></div>
      </header>
      <div className="container-shell py-8 sm:py-12"><InvoiceStatus token={token} /></div>
    </main>
  );
}
