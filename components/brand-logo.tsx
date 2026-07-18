import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  href = "#top",
  ariaLabel = "NALARA - kembali ke atas",
}: {
  className?: string;
  href?: string;
  ariaLabel?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)} aria-label={ariaLabel}>
      <Image src="/logo.png" alt="" width={40} height={40} className="size-10 object-contain" priority />
      <span className="font-heading text-xl font-bold tracking-[-0.04em] text-white">nalara</span>
    </Link>
  );
}
