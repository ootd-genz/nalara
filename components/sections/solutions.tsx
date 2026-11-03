import { Check, Gauge, LayoutTemplate, MessageCircle, Search, Smartphone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

const solutions = [
  {
    icon: LayoutTemplate,
    title: "Tampilan profesional & modern",
    text: "Konten usaha, keunggulan, produk, dan penawaran tersusun rapi untuk meyakinkan calon pelanggan.",
  },
  {
    icon: Smartphone,
    title: "Responsif di semua perangkat",
    text: "Optimal diakses melalui smartphone, tablet, maupun layar komputer dengan layout proporsional.",
  },
  {
    icon: MessageCircle,
    title: "Pemesanan langsung WhatsApp",
    text: "Tombol interaktif mengarahkan pengunjung ke WhatsApp Anda dengan template pesan otomatis.",
  },
  {
    icon: Search,
    title: "SEO Dasar & Metadata",
    text: "Judul halaman, deskripsi, dan Open Graph terkonfigurasi agar website mudah ditemukan di Google.",
  },
  {
    icon: Gauge,
    title: "Loading cepat & performa tinggi",
    text: "Kode website bersih dan ringan sehingga cepat terbuka dan tidak membuat calon pembeli menunggu.",
  },
  {
    icon: Check,
    title: "Domain resmi & garansi maintenance",
    text: "Mendapat domain .com, hosting, sertifikat SSL gratis, serta masa garansi maintenance setelah serah terima.",
  },
];

export function Solutions() {
  return (
    <section id="solusi" className="section-padding bg-[#0d110f]">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Solusi NALARA"
          title="Solusi website fleksibel sesuai tahap pertumbuhan bisnis Anda."
          description="Pilih paket sesuai kebutuhan: landing page statis untuk personal branding, landing page bisnis berdomain .com, hingga website multi-halaman lengkap."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="group flex gap-4 p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/8 text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)]">
                <Icon aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{text}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
