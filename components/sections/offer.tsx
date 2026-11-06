"use client";

import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  ExternalLink,
  FileCode2,
  Layers,
  MessageCircle,
  Rocket,
  Sparkles,
} from "lucide-react";
import { PromoOfferNotice, PromoOfferPrice } from "@/components/promo-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  beginnerPackage,
  businessPackage,
  starterPackage,
  staticLandingPackage,
} from "@/lib/commerce";
import {
  getBeginnerWhatsAppUrl,
  getBusinessWhatsAppUrl,
  getStarterWhatsAppUrl,
  getStaticLandingWhatsAppUrl,
} from "@/lib/site-config";
import { useContact } from "@/components/contact-provider";

export function Offer() {
  const { whatsappNumber, trackClick } = useContact();
  const staticLandingWhatsappUrl = getStaticLandingWhatsAppUrl(whatsappNumber);
  const beginnerWhatsappUrl = getBeginnerWhatsAppUrl(whatsappNumber);
  const starterWhatsappUrl = getStarterWhatsAppUrl(whatsappNumber);
  const businessWhatsappUrl = getBusinessWhatsAppUrl(whatsappNumber);

  return (
    <section id="penawaran" className="section-padding border-t border-white/6 bg-[#0d110f]">
      <div className="container-shell">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <Badge>
            <Sparkles className="mr-1.5 size-3.5" aria-hidden="true" /> Paket Pembuatan Website
          </Badge>
          <h2 className="font-heading mt-6 text-balance text-4xl font-bold tracking-[-0.045em] text-white md:text-6xl">
            Pilih paket website sesuai skala bisnis Anda.
          </h2>
          <p className="mt-5 text-base leading-7 text-[var(--muted-foreground)] md:text-lg">
            Mulai dari paket landing page statis cepat saji hemat biaya, landing page kustom profesional, hingga website multi-halaman untuk perusahaan.
          </p>
        </div>

        <PromoOfferNotice />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Paket Baru: Landing Page Statis (Rp200.000) */}
          <article className="flex h-full flex-col rounded-[32px] border border-[var(--accent)]/30 bg-[linear-gradient(170deg,rgba(74,222,128,0.06),rgba(21,26,23,1)_35%)] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]">
                <Layers className="size-6" aria-hidden="true" />
              </div>
              <Badge variant="muted" className="border-[var(--accent)]/30 text-[var(--accent)]">
                {staticLandingPackage.badge}
              </Badge>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
              {staticLandingPackage.subtitle}
            </p>
            <h3 className="font-heading mt-2 text-2xl font-bold tracking-[-0.04em] text-white">
              {staticLandingPackage.name}
            </h3>
            <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
              {staticLandingPackage.description}
            </p>
            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">Mulai dari:</p>
              <PromoOfferPrice
                promoPrice={staticLandingPackage.price}
                regularPrice={staticLandingPackage.regularPrice}
              />
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-white/90">
                Pelayanan yang didapat:
              </p>
              <ul className="mt-4 space-y-2.5">
                {staticLandingPackage.features.map((item) => (
                  <li key={item} className="flex gap-2.5 text-xs leading-5 text-[var(--muted-foreground)]">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <div className="grid grid-cols-2 gap-2">
                <Button asChild size="default" className="w-full bg-[var(--accent)] font-semibold text-[var(--accent-foreground)] hover:brightness-110">
                  <a
                    href={staticLandingWhatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cta="order-static-landing-whatsapp"
                    onClick={() => trackClick("footer")}
                  >
                    <MessageCircle className="size-3.5" aria-hidden="true" /> Pesan
                  </a>
                </Button>
                <Button asChild variant="outline" size="default" className="w-full border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.1] hover:text-white">
                  <Link href="/demo" data-cta="view-demo-pricelist">
                    <ExternalLink className="size-3.5" aria-hidden="true" /> Demo
                  </Link>
                </Button>
              </div>
            </div>
          </article>

          {/* 2. Paket Beginner */}
          <article className="flex h-full flex-col rounded-[32px] border border-white/10 bg-[var(--card)] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[var(--accent)]">
                <FileCode2 className="size-6" aria-hidden="true" />
              </div>
              <Badge variant="muted">Web Statis</Badge>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
              {beginnerPackage.subtitle}
            </p>
            <h3 className="font-heading mt-2 text-2xl font-bold tracking-[-0.04em] text-white">
              {beginnerPackage.name}
            </h3>
            <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
              {beginnerPackage.description}
            </p>
            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">Mulai dari:</p>
              <PromoOfferPrice promoPrice={beginnerPackage.price} regularPrice={beginnerPackage.regularPrice} />
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-white/90">Pelayanan yang didapat:</p>
              <ul className="mt-4 space-y-2.5">
                {beginnerPackage.features.map((item) => (
                  <li key={item} className="flex gap-2.5 text-xs leading-5 text-[var(--muted-foreground)]">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <Button asChild size="default" className="w-full">
                <a
                  href={beginnerWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cta="order-beginner-whatsapp"
                  onClick={() => trackClick("offer-beginner", "beginner")}
                >
                  <MessageCircle className="size-3.5" aria-hidden="true" /> Pesan Sekarang
                </a>
              </Button>
            </div>
          </article>

          {/* 3. Paket Starter (Paling Banyak Dipesan) */}
          <article className="relative flex h-full flex-col overflow-hidden rounded-[32px] border-2 border-[var(--accent)]/50 bg-[linear-gradient(155deg,rgba(74,222,128,0.12),rgba(21,26,23,1)_30%)] p-6 shadow-[0_32px_100px_rgba(23,107,69,0.28)]">
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-[var(--accent)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent-foreground)] shadow-md">
              Terpopuler
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20">
                <Rocket className="size-6" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
              Landing Page Komplit
            </p>
            <h3 className="font-heading mt-2 text-2xl font-bold tracking-[-0.04em] text-white">
              {starterPackage.name}
            </h3>
            <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
              {starterPackage.description}
            </p>
            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">Mulai dari:</p>
              <PromoOfferPrice promoPrice={starterPackage.price} regularPrice={starterPackage.regularPrice} />
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-white">Pelayanan yang didapat:</p>
              <ul className="mt-4 space-y-2.5">
                {starterPackage.features.map((item) => (
                  <li key={item} className="flex gap-2.5 text-xs leading-5 text-white/90">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <Button asChild size="default" className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-110">
                <a
                  href={starterWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cta="order-starter-whatsapp"
                  onClick={() => trackClick("offer-starter", "starter")}
                >
                  <MessageCircle className="size-3.5" aria-hidden="true" /> Pesan Sekarang
                </a>
              </Button>
            </div>
          </article>

          {/* 4. Paket Business */}
          <article className="flex h-full flex-col rounded-[32px] border border-white/10 bg-[var(--card)] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.25)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]">
                <Briefcase className="size-6" aria-hidden="true" />
              </div>
              <Badge variant="muted">Hingga 5 Halaman</Badge>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
              {businessPackage.subtitle}
            </p>
            <h3 className="font-heading mt-2 text-2xl font-bold tracking-[-0.04em] text-white">
              {businessPackage.name}
            </h3>
            <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
              {businessPackage.description}
            </p>
            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="text-xs font-medium text-[var(--muted-foreground)]">Mulai dari:</p>
              <PromoOfferPrice promoPrice={businessPackage.price} regularPrice={businessPackage.regularPrice} />
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-white/90">Pelayanan yang didapat:</p>
              <ul className="mt-4 space-y-2.5">
                {businessPackage.features.map((item) => (
                  <li key={item} className="flex gap-2.5 text-xs leading-5 text-[var(--muted-foreground)]">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <Button asChild size="default" className="w-full">
                <a
                  href={businessWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cta="order-business-whatsapp"
                  onClick={() => trackClick("offer-business", "business")}
                >
                  <MessageCircle className="size-3.5" aria-hidden="true" /> Pesan Sekarang
                </a>
              </Button>
            </div>
          </article>
        </div>

        <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-5 text-[var(--muted-foreground)]">
          Harga paket berlaku untuk ruang lingkup dan spesifikasi di atas. Perpanjangan domain & hosting tahun berikutnya, penambahan halaman, atau fitur kustom khusus dapat dikonsultasikan langsung bersama tim kami.
        </p>
      </div>
    </section>
  );
}
