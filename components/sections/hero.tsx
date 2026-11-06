"use client";

import { ArrowUpRight, CheckCircle2, AtSign, MessageCircle, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PromoAmount } from "@/components/promo-price";
import { beginnerPackage } from "@/lib/commerce";
import { getConsultationWhatsAppUrl, instagramUrl, siteConfig } from "@/lib/site-config";
import { useContact } from "@/components/contact-provider";

const benefits = [
  "Desain responsif mobile & desktop",
  "Gratis domain (.com) & SSL",
  "Garansi maintenance & revisi",
];

const showcaseItems = [
  {
    title: "Profil Bisnis",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&h=375&q=80",
  },
  {
    title: "Landing Page",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&h=375&q=80",
  },
  {
    title: "Domain .com & Email",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&h=375&q=80",
  },
  {
    title: "Pesan via WhatsApp",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&h=375&q=80",
  },
];

export function Hero() {
  const { whatsappNumber, trackClick } = useContact();
  const whatsappUrl = getConsultationWhatsAppUrl(whatsappNumber);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="hero-grid absolute inset-0 -z-20 opacity-50" />
      <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-[var(--primary)]/20 blur-[130px]" />
      <div className="container-shell">
        <nav className="flex items-center justify-between py-4 sm:py-5" aria-label="Navigasi utama">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href={instagramUrl} target="_blank" rel="noreferrer" data-cta="nav-instagram">
                <AtSign aria-hidden="true" />
                {siteConfig.instagramHandle}
              </a>
            </Button>
            <Button asChild size="sm">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                data-cta="nav-whatsapp"
                onClick={() => trackClick("hero")}
              >
                <MessageCircle aria-hidden="true" /> Konsultasi
              </a>
            </Button>
          </div>
        </nav>

        <div className="hero-stage grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-10 xl:grid-cols-[1.12fr_.88fr] xl:gap-14">
          <div className="min-w-0">
            <Badge variant="muted">Jasa Pembuatan Website & Landing Page Profesional</Badge>
            <h1 className="font-heading mt-5 max-w-4xl text-balance text-[clamp(2.5rem,11vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.05em] text-white sm:mt-6 sm:text-5xl md:text-6xl md:leading-[1.03] lg:text-5xl xl:text-6xl 2xl:text-7xl">
              Tingkatkan kredibilitas bisnis Anda dengan <span className="text-[var(--accent)]">website profesional</span>.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[var(--muted-foreground)] sm:mt-6 sm:text-lg sm:leading-8 md:text-xl">
              Pilih paket Beginner untuk website statis, Starter dengan domain .com dan email bisnis, atau Business untuk kebutuhan hingga 5 halaman.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Button asChild size="lg" className="h-auto min-h-13 w-full whitespace-normal py-3 text-center sm:w-auto">
                <a href="#penawaran" data-cta="hero-packages">
                  <Sparkles aria-hidden="true" /> Lihat Paket Mulai <PromoAmount promoPrice={beginnerPackage.price} regularPrice={beginnerPackage.regularPrice} />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-auto min-h-13 w-full whitespace-normal py-3 text-center sm:w-auto">
                <a href="#portofolio" data-cta="hero-portfolio">
                  Lihat Portofolio Klien <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            </div>
            <ul className="mt-7 grid gap-3 text-sm text-[var(--muted-foreground)] sm:mt-8 sm:grid-cols-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[var(--accent)]" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[500px] min-w-0 lg:max-w-[450px] xl:max-w-[470px]">
            <div className="absolute -inset-4 -z-10 rounded-[44px] bg-[var(--accent)]/10 blur-3xl sm:-inset-6" />
            <div className="rounded-[28px] border border-white/10 bg-[#111612] p-2.5 shadow-[0_40px_100px_rgba(0,0,0,0.48)] sm:rounded-[34px] sm:p-3">
              <div className="rounded-[22px] border border-white/8 bg-[var(--background)] p-3 sm:rounded-[26px] sm:p-4">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-[#ff6b6b]" />
                    <span className="size-2.5 rounded-full bg-[#ffd166]" />
                    <span className="size-2.5 rounded-full bg-[var(--accent)]" />
                  </div>
                  <span className="text-[11px] text-[var(--muted-foreground)]">bisnisanda.com</span>
                </div>
                <div className="py-5">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    Desain Eksklusif
                  </span>
                  <h2 className="font-heading mt-3 text-2xl font-bold tracking-[-0.04em] text-white lg:text-xl xl:text-2xl">
                    Tampilan Modern. Pelanggan Percaya.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                    Website siap online dengan domain sendiri, email bisnis, dan tombol WhatsApp otomatis.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 lg:gap-2.5">
                    {showcaseItems.map((item) => (
                      <div
                        key={item.title}
                        className="min-w-0 overflow-hidden rounded-xl border border-white/8 bg-white/[0.035] p-2 sm:rounded-2xl sm:p-2.5 lg:grid lg:grid-cols-[68px_minmax(0,1fr)] lg:items-center lg:gap-2"
                      >
                        <div
                          className="mb-2.5 aspect-video rounded-lg bg-cover bg-center sm:rounded-xl lg:mb-0 lg:aspect-square"
                          style={{ backgroundImage: `url(${item.image})` }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-white sm:whitespace-normal lg:truncate">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">Garansi Revisi</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a
                    href="#penawaran"
                    className="mt-4 flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-[var(--accent-foreground)] transition hover:brightness-110"
                  >
                    Pilih Paket Sekarang
                  </a>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-2 rounded-2xl border border-[var(--accent)]/25 bg-[#111612]/95 px-4 py-3 shadow-xl backdrop-blur sm:-bottom-5 sm:-left-4 md:-left-8">
              <p className="text-xs text-[var(--muted-foreground)]">Mulai sekarang</p>
              <PromoAmount
                promoPrice={beginnerPackage.price}
                regularPrice={beginnerPackage.regularPrice}
                className="font-heading text-xl font-bold text-[var(--accent)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
