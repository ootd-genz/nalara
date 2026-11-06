"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Layers,
  MessageCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/sections/footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { useContact } from "@/components/contact-provider";
import {
  demoCategories,
  demoTemplates,
  type DemoCategory,
  type DemoTemplate,
} from "@/lib/demo-templates";
import { formatRupiah, staticLandingPackage } from "@/lib/commerce";
import {
  getConsultationWhatsAppUrl,
  getStaticLandingWhatsAppUrl,
  instagramUrl,
  siteConfig,
} from "@/lib/site-config";

export function DemoShowcase() {
  const { whatsappNumber, trackClick } = useContact();
  const [selectedCategory, setSelectedCategory] = useState<DemoCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const consultationWhatsappUrl = getConsultationWhatsAppUrl(whatsappNumber);

  const filteredTemplates = useMemo(() => {
    return demoTemplates.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Top Banner Notice */}
      <aside className="border-b border-white/8 bg-[#101712] px-4 py-2.5 text-center text-xs text-[var(--muted-foreground)]">
        <span className="inline-flex items-center gap-1.5 font-medium text-white">
          <Sparkles className="size-3.5 text-[var(--accent)]" aria-hidden="true" />
          Paket Baru Rp200.000:
        </span>{" "}
        Pilih salah satu template landing page di bawah ini, siap online dalam 1-2 hari!
      </aside>

      {/* Navigation Header */}
      <header className="border-b border-white/6 bg-[#0b0e0c]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="container-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <BrandLogo href="/" />
            <span className="hidden sm:inline-block h-4 w-px bg-white/10" aria-hidden="true" />
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-white transition-colors"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="border-white/15 text-xs">
              <Link href="/#penawaran">
                Lihat Pricelist
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-110 text-xs font-semibold">
              <a
                href={getStaticLandingWhatsAppUrl(whatsappNumber)}
                target="_blank"
                rel="noreferrer"
                data-cta="demo-nav-order"
                onClick={() => trackClick("floating")}
              >
                <MessageCircle className="size-3.5" aria-hidden="true" /> Pesan Rp200rb
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative overflow-hidden py-14 md:py-20 border-b border-white/6">
        <div className="hero-grid absolute inset-0 -z-20 opacity-40" />
        <div className="absolute left-1/2 top-0 -z-10 h-[380px] w-[620px] -translate-x-1/2 rounded-full bg-[var(--primary)]/20 blur-[120px]" />
        
        <div className="container-shell text-center max-w-3xl">
          <Badge className="border-[var(--accent)]/30 text-[var(--accent)]">
            <Layers className="mr-1.5 size-3.5" aria-hidden="true" />
            Galeri Template Landing Page Statis
          </Badge>
          
          <h1 className="font-heading mt-6 text-balance text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            Pilih Desain Landing Page Impian Anda.
          </h1>
          
          <p className="mt-5 text-base leading-7 text-[var(--muted-foreground)] md:text-lg">
            Semua template di bawah ini siap Anda miliki melalui{" "}
            <strong className="text-white">Paket Landing Page Statis ({formatRupiah(staticLandingPackage.price)})</strong>.
            Desain responsif, super cepat, dan langsung terintegrasi dengan tombol WhatsApp bisnis Anda.
          </p>

          {/* Quick Package Benefits Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
              <CheckCircle2 className="size-3.5 text-[var(--accent)]" aria-hidden="true" />
              Harga Tetap {formatRupiah(staticLandingPackage.price)}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
              <CheckCircle2 className="size-3.5 text-[var(--accent)]" aria-hidden="true" />
              Pengerjaan Kilat 1-2 Hari
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
              <CheckCircle2 className="size-3.5 text-[var(--accent)]" aria-hidden="true" />
              Termasuk File Source Code (.html)
            </span>
          </div>

          {/* Search Box */}
          <div className="mt-10 mx-auto max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)]" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari template: 'Fintech', 'Fashion', 'Portfolio', dsb..."
                className="w-full rounded-full border border-white/15 bg-white/[0.05] py-2.5 pl-10 pr-4 text-xs text-white placeholder-[var(--muted-foreground)] backdrop-blur-sm transition-all focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] sm:text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Showcase */}
      <main className="section-padding py-12 md:py-16">
        <div className="container-shell">
          {/* Category Filter Tabs */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {demoCategories.map(({ key, label }) => {
              const count =
                key === "all"
                  ? demoTemplates.length
                  : demoTemplates.filter((p) => p.category === key).length;
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
                      isActive
                        ? "bg-black/20 text-[var(--accent-foreground)]"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results count & status */}
          <div className="mb-6 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <p>
              Menampilkan <span className="font-semibold text-white">{filteredTemplates.length}</span> template
              {searchQuery ? ` untuk pencarian "${searchQuery}"` : ""}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[var(--accent)] hover:underline"
              >
                Reset pencarian
              </button>
            )}
          </div>

          {/* Template Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="rounded-[24px] border border-white/10 bg-[var(--card)] p-12 text-center">
              <p className="text-base font-semibold text-white">Tidak ada template yang cocok</p>
              <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                Coba gunakan kata kunci pencarian lain atau pilih tab &quot;Semua Template&quot;.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                Tampilkan Semua Template
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => {
                const orderWhatsappUrl = getStaticLandingWhatsAppUrl(
                  whatsappNumber,
                  template.name
                );

                return (
                  <Card
                    key={template.id}
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
                        <span className="max-w-[140px] truncate sm:max-w-[170px]">
                          nalara.id{template.demoUrl}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-[var(--accent)]">
                        <span className="size-1.5 rounded-full bg-[var(--accent)] motion-safe:animate-pulse" />
                        <span>Ready</span>
                      </div>
                    </div>

                    {/* Live Preview Window Frame (Scaled iframe) */}
                    <div className="relative h-44 w-full overflow-hidden bg-black/60 border-b border-white/6">
                      <iframe
                        src={template.demoUrl}
                        title={template.name}
                        className="pointer-events-none absolute left-0 top-0 h-[650px] w-[1000px] origin-top-left scale-[0.35] select-none opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                        loading="lazy"
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent opacity-80" />
                      
                      {/* Overlay CTA on hover */}
                      <a
                        href={template.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100"
                        aria-label={`Buka demo ${template.name}`}
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-bold text-black shadow-lg">
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                          Buka Layar Penuh
                        </span>
                      </a>
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="muted" className="text-[11px]">
                          {template.categoryLabel}
                        </Badge>
                        {template.isPopular && (
                          <span className="rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/30 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                            Terpopuler
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading mt-3 text-lg font-bold text-white transition-colors group-hover:text-[var(--accent)]">
                        {template.name}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
                        {template.description}
                      </p>

                      <div className="mt-3 rounded-lg border border-white/6 bg-white/[0.02] p-2.5">
                        <p className="text-[11px] font-medium text-[var(--muted-foreground)]">
                          <strong className="text-white/80">Cocok untuk:</strong> {template.targetAudience}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {template.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-white/8 bg-white/[0.02] px-2 py-0.5 text-[10px] text-white/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Card Actions */}
                      <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex-1 border-white/15 bg-white/[0.03] text-xs text-white hover:bg-white/[0.08]"
                        >
                          <a
                            href={template.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            data-cta={`demo-view-${template.id}`}
                          >
                            <ExternalLink className="mr-1.5 size-3.5" aria-hidden="true" />
                            Lihat Demo
                          </a>
                        </Button>

                        <Button
                          asChild
                          size="sm"
                          className="flex-1 bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-110 text-xs font-semibold"
                        >
                          <a
                            href={orderWhatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            data-cta={`demo-order-${template.id}`}
                            onClick={() => trackClick("floating")}
                          >
                            <MessageCircle className="mr-1.5 size-3.5" aria-hidden="true" />
                            Pesan Ini
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Bottom Call to Action */}
          <div className="mt-16 rounded-[32px] border border-[var(--accent)]/30 bg-[linear-gradient(160deg,rgba(74,222,128,0.1),rgba(21,26,23,1)_50%)] p-8 text-center sm:p-12 shadow-[0_32px_100px_rgba(23,107,69,0.2)]">
            <Badge className="border-[var(--accent)]/30 text-[var(--accent)]">
              <Sparkles className="mr-1.5 size-3.5" aria-hidden="true" />
              Ingin Kustomisasi atau Fitur Lain?
            </Badge>

            <h2 className="font-heading mt-5 text-2xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
              Siap Memulai Website Bisnis Anda Hari Ini?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
              Pilih template statis hemat seharga <strong className="text-white">Rp200.000</strong>, atau konsultasikan kebutuhan landing page komplit dengan domain .com dan email bisnis bersama tim kami.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-110 font-semibold">
                <a
                  href={getStaticLandingWhatsAppUrl(whatsappNumber)}
                  target="_blank"
                  rel="noreferrer"
                  data-cta="demo-bottom-order-whatsapp"
                  onClick={() => trackClick("floating")}
                >
                  <MessageCircle className="mr-2 size-4" aria-hidden="true" />
                  Pesan Paket Statis Rp200rb
                </a>
              </Button>

              <Button asChild variant="outline" size="lg" className="border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                <a
                  href={consultationWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cta="demo-bottom-consultation"
                  onClick={() => trackClick("floating")}
                >
                  Konsultasi Gratis
                </a>
              </Button>

              <Button asChild variant="ghost" size="lg" className="text-[var(--muted-foreground)] hover:text-white">
                <Link href="/#penawaran">
                  Lihat Semua Paket Lainnya &rarr;
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer & Floating WhatsApp */}
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
