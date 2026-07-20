import { ArrowUpRight, CheckCircle2, MessageCircle, ShoppingBag, Sparkles, Store } from "lucide-react";
import { PromoOfferNotice, PromoOfferPrice } from "@/components/promo-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { onlineStorePackage, starterPackage } from "@/lib/commerce";
import { catalogWhatsappUrl, onlineStoreWhatsappUrl } from "@/lib/site-config";

const catalogFeatures = [
  "Katalog produk yang rapi dan responsif",
  "Tombol pemesanan langsung melalui WhatsApp",
  "Dapat diarahkan ke Shopee atau Tokopedia",
  "Mendukung link affiliate dan tautan lainnya",
];

const onlineStoreFeatures = [
  "Alur belanja dan checkout toko online",
  "Pembayaran melalui QRIS dan transfer bank",
  "Mendukung DANA dan metode pembayaran lainnya",
  "Tampilan responsif untuk desktop dan mobile",
];

export function Offer() {
  return (
    <section id="penawaran" className="section-padding border-t border-white/6 bg-[#0d110f]">
      <div className="container-shell">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <Badge><Sparkles className="mr-1.5 size-3.5" aria-hidden="true" /> Katalog Paket Website</Badge>
          <h2 className="font-heading mt-6 text-balance text-4xl font-bold tracking-[-0.045em] text-white md:text-6xl">Pilih website sesuai cara bisnis Anda berjualan.</h2>
          <p className="mt-5 text-base leading-7 text-[var(--muted-foreground)] md:text-lg">Mulai dari katalog sederhana yang mengarahkan pembeli ke kanal favorit Anda, hingga toko online dengan sistem pembayaran lengkap.</p>
        </div>

        <PromoOfferNotice />

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <article className="flex h-full flex-col rounded-[32px] border border-white/10 bg-[var(--card)] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.25)] sm:p-8 md:p-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]"><ShoppingBag aria-hidden="true" /></div>
              <Badge variant="muted">Paket Hemat</Badge>
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Untuk promosi & affiliate</p>
            <h3 className="font-heading mt-2 text-3xl font-bold tracking-[-0.04em] text-white">{starterPackage.name}</h3>
            <p className="mt-3 min-h-14 text-sm leading-6 text-[var(--muted-foreground)]">Website katalog produk dengan tombol pemesanan melalui WhatsApp atau diarahkan ke marketplace dan link lainnya.</p>
            <PromoOfferPrice promoPrice={starterPackage.price} regularPrice={starterPackage.regularPrice} />
            <ul className="mt-7 space-y-3">{catalogFeatures.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--muted-foreground)]"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" aria-hidden="true" />{item}</li>)}</ul>
            <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
              <Button asChild size="lg"><a href={catalogWhatsappUrl} target="_blank" rel="noreferrer" data-cta="catalog-order-whatsapp"><MessageCircle aria-hidden="true" /> Pesan via WhatsApp</a></Button>
              <Button asChild variant="outline" size="lg"><a href={catalogWhatsappUrl} target="_blank" rel="noreferrer" data-cta="catalog-whatsapp"><MessageCircle aria-hidden="true" /> Tanya via WhatsApp</a></Button>
            </div>
          </article>

          <article className="relative flex h-full flex-col overflow-hidden rounded-[32px] border border-[var(--accent)]/30 bg-[linear-gradient(145deg,rgba(74,222,128,0.1),rgba(21,26,23,1)_35%)] p-6 shadow-[0_32px_100px_rgba(23,107,69,0.2)] sm:p-8 md:p-10">
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-[var(--accent)] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--accent-foreground)]">Paling Lengkap</div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)]"><Store aria-hidden="true" /></div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Untuk transaksi langsung</p>
            <h3 className="font-heading mt-2 text-3xl font-bold tracking-[-0.04em] text-white">{onlineStorePackage.name}</h3>
            <p className="mt-3 min-h-14 text-sm leading-6 text-[var(--muted-foreground)]">Website toko online dengan sistem pembayaran seperti QRIS, transfer bank, DANA, dan metode pembayaran lainnya.</p>
            <PromoOfferPrice promoPrice={onlineStorePackage.price} regularPrice={onlineStorePackage.regularPrice} />
            <ul className="mt-7 space-y-3">{onlineStoreFeatures.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--muted-foreground)]"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" aria-hidden="true" />{item}</li>)}</ul>
            <div className="mt-auto pt-8">
              <Button asChild size="lg" className="w-full"><a href={onlineStoreWhatsappUrl} target="_blank" rel="noreferrer" data-cta="online-store-whatsapp"><MessageCircle aria-hidden="true" /> Konsultasi Paket <ArrowUpRight aria-hidden="true" /></a></Button>
            </div>
          </article>
        </div>
        <p className="mx-auto mt-7 max-w-4xl text-center text-xs leading-5 text-[var(--muted-foreground)]">Harga paket berlaku untuk ruang lingkup standar. Domain, hosting berbayar, biaya payment gateway, biaya marketplace, dan fitur custom dibicarakan sesuai kebutuhan sebelum pengerjaan.</p>
      </div>
    </section>
  );
}
