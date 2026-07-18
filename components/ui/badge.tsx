import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide", {
  variants: {
    variant: {
      default: "border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--accent)]",
      muted: "border-white/10 bg-white/[0.04] text-[var(--muted-foreground)]",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
export function Badge({ className, variant, ...props }: BadgeProps) { return <div className={cn(badgeVariants({ variant }), className)} {...props} />; }
