import { CircleHelp, SearchX, ShieldQuestion, WalletCards } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const problems = [
  { icon: ShieldQuestion, title: "Calon pembeli belum yakin", description: "Bisnis yang hanya mengandalkan chat atau media sosial sering terlihat belum memiliki pusat informasi resmi." },
  { icon: SearchX, title: "Produk sulit ditemukan", description: "Foto dan informasi produk tenggelam di feed, sehingga pelanggan harus bertanya satu per satu." },
  { icon: CircleHelp, title: "Pelanggan bingung harus mulai dari mana", description: "Tanpa alur yang jelas, calon pelanggan melihat-lihat tetapi tidak segera mengambil tindakan." },
  { icon: WalletCards, title: "Biaya website terasa terlalu besar", description: "Website e-commerce custom memang dapat memerlukan anggaran jutaan karena desain, sistem, dan integrasi yang lebih kompleks." },
];

export function Problems() {
  return (
    <section id="masalah" className="section-padding border-t border-white/6">
      <div className="container-shell">
        <SectionHeading eyebrow="Masalah yang sering terjadi" title="Produk bagus belum tentu terlihat meyakinkan secara online." description="Website bukan sekadar pajangan. Ia membantu calon pelanggan memahami produk, menilai kredibilitas, dan menemukan jalur pemesanan yang jelas." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {problems.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="transition-transform duration-300 hover:-translate-y-1"><CardHeader><div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]"><Icon aria-hidden="true" /></div></CardHeader><CardContent><h3 className="font-heading text-lg font-bold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p></CardContent></Card>
          ))}
        </div>
      </div>
    </section>
  );
}
