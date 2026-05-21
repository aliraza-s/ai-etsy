import { ShieldCheck, Sparkles, Zap, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section } from "./section";

const DEFAULT_ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Sparkles,
    title: "AI-powered",
    body: "Claude & Qwen models behind every tool",
  },
  {
    icon: Zap,
    title: "Results in seconds",
    body: "Optimized listings without the rewrite cycle",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first",
    body: "No Etsy API. No scraping. You paste, we process.",
  },
  {
    icon: Heart,
    title: "Built by sellers",
    body: "Refined by AI engineers who get the grind",
  },
];

export function TrustStrip({ items = DEFAULT_ITEMS }: { items?: typeof DEFAULT_ITEMS }) {
  return (
    <Section className="border-border/60 relative isolate border-y py-10 sm:py-12">
      <div
        aria-hidden
        className="dot-pattern pointer-events-none absolute inset-0 -z-10 opacity-50"
      />
      <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {items.map(({ icon: Icon, title, body }) => (
          <li key={title} className="group flex items-start gap-3">
            <span className="bg-primary/10 text-primary ring-primary/20 flex size-10 flex-none items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-sm font-semibold">{title}</p>
              <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
