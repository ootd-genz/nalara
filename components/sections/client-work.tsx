import Image from "next/image";
import { CheckCircle2, ExternalLink, Globe2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = ["Katalog produk", "Pencarian", "Detail produk", "Pemesanan online"];

export function ClientWork() {
  return (
    <section id="portofolio" className="section-padding border-t border-white/6">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Portofolio Client"
          title="Lihat contoh website yang sudah online."
          description="Bukti nyata dari website client sebelumnya agar Anda dapat melihat langsung kualitas tampilan dan pengalaman belanja yang kami bangun."
        />

        <Card className="grid overflow-hidden lg:grid-cols-[1.18fr_.82fr]">
          <a
            href="https://www.azzamazhari.web.id/"
            target="_blank"
            rel="noreferrer"
            className="group relative min-h-[220px] overflow-hidden border-b border-white/8 bg-white/[0.025] sm:min-h-[280px] lg:min-h-[430px] lg:border-b-0 lg:border-r"
            aria-label="Buka website e-commerce NusaMart milik client"
          >
            <Image
              src="/client-azzam-website.jpg"
              alt="Tampilan website e-commerce NusaMart milik client sebelumnya"
              width={1265}
              height={712}
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0b0e0c]/90 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur sm:bottom-4 sm:right-4 sm:px-4 sm:text-sm">
              Lihat website <ExternalLink className="size-4" aria-hidden="true" />
            </span>
          </a>

          <div className="flex flex-col justify-center p-6 sm:p-7 md:p-10 lg:p-12">
            <Badge variant="muted" className="w-fit">
              <CheckCircle2 className="mr-1.5 size-3.5 text-[var(--accent)]" aria-hidden="true" /> Website client sebelumnya
            </Badge>
            <h3 className="font-heading mt-6 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl">
              NusaMart
            </h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-[var(--accent)]">
              <Globe2 className="size-4" aria-hidden="true" /> azzamazhari.web.id
            </p>
            <p className="mt-5 text-base leading-7 text-[var(--muted-foreground)]">
              Website e-commerce dengan tampilan profesional yang memudahkan pengunjung mencari, melihat, dan memilih produk sebelum melakukan pemesanan.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-[var(--muted-foreground)] sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 w-fit">
              <a href="https://www.azzamazhari.web.id/" target="_blank" rel="noreferrer" data-cta="portfolio-client">
                Kunjungi Website Client <ExternalLink aria-hidden="true" />
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
