import { ArrowRight } from "lucide-react";
import { PromoAnnouncementPrice, PromoStatusLabel } from "@/components/promo-price";
import { PromoTimer } from "@/components/promo-timer";
import { starterPackage } from "@/lib/commerce";

export function Announcement() {
  return (
    <div className="sticky top-0 z-50 border-b border-[var(--accent)]/15 bg-[#0b0e0c]/95 px-2 py-2 text-center text-xs text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur-md sm:px-4 sm:py-2.5 sm:text-sm">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <a href="#penawaran" className="group inline-flex min-w-0 items-center justify-center gap-x-1.5 font-medium sm:gap-x-2" data-cta="announcement-packages">
          <span className="hidden shrink-0 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-extrabold tracking-[0.12em] text-[var(--accent-foreground)] sm:inline"><PromoStatusLabel /></span>
          <span className="truncate sm:hidden">Katalog <PromoAnnouncementPrice promoPrice={starterPackage.price} regularPrice={starterPackage.regularPrice} /></span>
          <span className="hidden sm:inline">Website Katalog Produk <PromoAnnouncementPrice promoPrice={starterPackage.price} regularPrice={starterPackage.regularPrice} /></span>
          <ArrowRight className="hidden size-3.5 shrink-0 transition-transform group-hover:translate-x-1 lg:block" aria-hidden="true" />
        </a>
        <PromoTimer />
      </div>
    </div>
  );
}
