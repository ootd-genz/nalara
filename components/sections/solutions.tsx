import { Check, Gauge, LayoutTemplate, MessageCircle, Search, Smartphone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

const solutions = [
  { icon: LayoutTemplate, title: "Etalase produk yang rapi", text: "Produk, harga, dan informasi penting tersusun dalam satu halaman yang mudah dipahami." },
  { icon: Smartphone, title: "Responsif di ponsel", text: "Tampilan dioptimalkan untuk perangkat yang paling sering dipakai calon pelanggan Anda." },
  { icon: MessageCircle, title: "Pemesanan yang fleksibel", text: "Arahkan pelanggan ke WhatsApp, Shopee, Tokopedia, link affiliate, atau checkout toko online." },
  { icon: Search, title: "Basic SEO & metadata", text: "Judul, deskripsi, dan metadata dasar disiapkan agar halaman lebih mudah dikenali mesin pencari." },
  { icon: Gauge, title: "Ringan dan cepat", text: "Halaman utama diprarender, sementara checkout aman dijalankan hanya saat dibutuhkan." },
  { icon: Check, title: "Mudah dipublikasikan", text: "Anda mendapat panduan publikasi dasar dan penjelasan bagian yang dapat diperbarui." },
];

export function Solutions() {
  return (
    <section id="solusi" className="section-padding bg-[#0d110f]">
      <div className="container-shell">
        <SectionHeading eyebrow="Solusi NALARA" title="Mulai dari katalog sederhana, lalu berkembang menjadi toko online." description="Pilih paket sesuai alur penjualan bisnis Anda: arahkan pelanggan ke kanal yang sudah digunakan atau terima pembayaran langsung melalui website." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="group flex gap-4 p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/8 text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)]"><Icon aria-hidden="true" /></div>
              <div><h3 className="font-heading text-lg font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{text}</p></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
