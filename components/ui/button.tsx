import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_14px_40px_rgba(74,222,128,0.18)] hover:-translate-y-0.5 hover:bg-[#63e492]",
        outline: "border border-white/12 bg-white/[0.03] text-[var(--foreground)] hover:border-[var(--accent)]/45 hover:bg-[var(--accent)]/8",
        ghost: "text-[var(--muted-foreground)] hover:bg-white/[0.05] hover:text-white",
      },
      size: { default: "h-11 px-5 py-2", sm: "h-9 rounded-lg px-4", lg: "h-13 rounded-2xl px-6 text-base", icon: "size-11" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";
export { Button, buttonVariants };
