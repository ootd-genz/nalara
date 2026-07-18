import { Badge } from "@/components/ui/badge";
export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      <Badge>{eyebrow}</Badge>
      <h2 className="font-heading mt-5 text-balance text-3xl font-bold tracking-[-0.04em] text-white md:text-5xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-[var(--muted-foreground)] md:text-lg">{description}</p>
    </div>
  );
}
