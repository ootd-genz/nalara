"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, Globe2, MessageCircle, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  portfolioCategories,
  portfolioProjects,
  type PortfolioCategory,
} from "@/lib/portfolio-data";
import { getConsultationWhatsAppUrl } from "@/lib/site-config";
import { useContact } from "@/components/contact-provider";

export function ClientWork() {
  const { whatsappNumber, trackClick } = useContact();
  const whatsappUrl = getConsultationWhatsAppUrl(whatsappNumber);
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>("all");

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return portfolioProjects;
    return portfolioProjects.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section id="portofolio" className="section-padding border-t border-white/6 bg-[#0a0d0b]">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Portofolio Klien"
          title="Karya nyata yang telah berjalan & siap memajukan bisnis Anda."
          description="Jelajahi rekam jejak website dan sistem digital yang telah kami bangun untuk berbagai bidang: dari toko online, portal edukasi, wedding booking, hingga sistem operasional web app."
        />

        {/* Filter Kategori Tab */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {portfolioCategories.map(({ key, label }) => {
            const count =
              key === "all"
                ? portfolioProjects.length
                : portfolioProjects.filter((p) => p.category === key).length;
            const isActive = selectedCategory === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCategory(key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  isActive
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/20"
                    : "border border-white/10 bg-white/[0.03] text-[var(--muted-foreground)] hover:border-white/20 hover:text-white"
                }`}
                aria-pressed={isActive}
              >
                <span>{label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive ? "bg-black/20 text-[var(--accent-foreground)]" : "bg-white/10 text-white/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid Kartu Proyek */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-[var(--card)] p-0 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[0_24px_60px_rgba(74,222,128,0.12)]"
            >
              {/* Header Mockup Browser Frame */}
              <div className="flex items-center justify-between border-b border-white/8 bg-[#131915] px-4 py-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#ff5f56]/90" />
                  <span className="size-2.5 rounded-full bg-[#ffbd2e]/90" />
                  <span className="size-2.5 rounded-full bg-[#27c93f]/90" />
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2.5 py-1 text-[11px] font-mono text-[var(--muted-foreground)]">
                  <Globe2 className="size-3 text-[var(--accent)]" aria-hidden="true" />
                  <span className="max-w-[150px] truncate sm:max-w-[190px]">{project.domain}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium text-[var(--accent)]">
                  <span className="size-1.5 rounded-full bg-[var(--accent)] motion-safe:animate-pulse" />
                  <span>Live</span>
                </div>
              </div>

              {/* Konten Kartu */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="muted" className="text-[11px]">
                    {project.categoryLabel}
                  </Badge>
                  {project.isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--accent)]">
                      <Sparkles className="size-3" aria-hidden="true" /> Unggulan
                    </span>
                  )}
                </div>

                <h3 className="font-heading mt-4 text-xl font-bold tracking-[-0.03em] text-white transition-colors group-hover:text-[var(--accent)]">
                  {project.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-[var(--accent)]/90">
                  {project.headline}
                </p>

                <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                  {project.description}
                </p>

                {/* Tags Fitur */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-white/8 bg-white/[0.03] px-2 py-1 text-[11px] text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tombol Kunjungi Website */}
                <div className="mt-auto pt-6">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full justify-center border-white/12 bg-white/[0.02] text-white transition-all group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)]"
                  >
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      data-cta={`portfolio-${project.id}`}
                    >
                      <span>Kunjungi Website</span>
                      <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Bawah Portofolio */}
        <div className="mt-14 overflow-hidden rounded-[28px] border border-[var(--accent)]/25 bg-[linear-gradient(135deg,rgba(74,222,128,0.08),rgba(21,26,23,0.95)_40%)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:p-8 md:p-10">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="max-w-2xl">
              <Badge variant="muted">
                <Sparkles className="mr-1.5 size-3 text-[var(--accent)]" aria-hidden="true" /> Konsultasi Proyek Gratis
              </Badge>
              <h3 className="font-heading mt-4 text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
                Ingin punya website atau sistem modern seperti portofolio di atas?
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                Ceritakan kebutuhan bisnis atau ide aplikasi Anda. Tim NALARA siap membantu mewujudkannya dengan kualitas teruji, cepat, dan bergaransi.
              </p>
            </div>
            <div className="shrink-0">
              <Button asChild size="lg" className="shadow-lg shadow-[var(--accent)]/20">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cta="portfolio-cta-whatsapp"
                  onClick={() => trackClick("portfolio-banner")}
                >
                  <MessageCircle aria-hidden="true" /> Konsultasi Sekarang <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
