"use client";

import { formatRupiah } from "@/lib/commerce";
import { usePromoTimer } from "@/components/promo-timer";

type PromoPriceProps = {
  promoPrice: number;
  regularPrice: number;
};

export function PromoAmount({ promoPrice, regularPrice, className = "" }: PromoPriceProps & { className?: string }) {
  const timer = usePromoTimer();
  const amount = timer?.phase === "pause" ? regularPrice : promoPrice;

  return <span className={className}>{formatRupiah(amount)}</span>;
}

export function PromoAnnouncementPrice({ promoPrice, regularPrice }: PromoPriceProps) {
  const timer = usePromoTimer();
  const isPaused = timer?.phase === "pause";

  return (
    <span>
      <strong>{formatRupiah(isPaused ? regularPrice : promoPrice)}</strong>
      {!isPaused && <span className="ml-1.5 text-[var(--muted-foreground)] line-through">{formatRupiah(regularPrice)}</span>}
      {isPaused && <span className="ml-1.5 text-amber-200">harga normal</span>}
    </span>
  );
}

export function PromoStatusLabel() {
  const timer = usePromoTimer();
  return <>{timer?.phase === "pause" ? "JEDA PROMO" : "PROMO PORTOFOLIO"}</>;
}

export function PromoOfferPrice({ promoPrice, regularPrice }: PromoPriceProps) {
  const timer = usePromoTimer();
  const isPaused = timer?.phase === "pause";

  return (
    <>
      <div className="mt-7 flex flex-wrap items-end gap-x-3 gap-y-1">
        <span className={`font-heading text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl ${isPaused ? "text-white" : "text-[var(--accent)]"}`}>
          {formatRupiah(isPaused ? regularPrice : promoPrice)}
        </span>
        {!isPaused && <span className="pb-1.5 text-base text-[var(--muted-foreground)] line-through decoration-2">{formatRupiah(regularPrice)}</span>}
      </div>
      <p className={`mt-2 text-xs font-semibold ${isPaused ? "text-amber-200" : "text-[var(--accent)]"}`}>
        {isPaused ? "Harga normal berlaku selama jeda promo" : `Hemat ${formatRupiah(regularPrice - promoPrice)}`}
      </p>
    </>
  );
}
