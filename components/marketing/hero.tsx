import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { HeroIllustration } from "@/components/illustrations/hero-illustration";
import { cn } from "@/lib/utils";

export interface HeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** ≤ 50-word TL;DR — AIO/GEO direct-answer capture. */
  tldr: ReactNode;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  /** Inline trust signals shown below the CTAs. */
  trustSignals?: string[];
  illustration?: ReactNode;
  className?: string;
}

export function Hero({
  eyebrow,
  title,
  tldr,
  primaryCta,
  secondaryCta,
  trustSignals,
  illustration,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pt-16 pb-20 sm:pt-20 lg:pt-28 lg:pb-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="from-primary/10 via-background to-accent/5 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          {eyebrow && (
            <span className="bg-secondary text-secondary-foreground ring-border mb-6 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1">
              <span className="bg-primary mr-2 h-1.5 w-1.5 animate-pulse rounded-full" />
              {eyebrow}
            </span>
          )}
          <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg text-balance">{tldr}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={primaryCta.href}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center gap-1.5 rounded-md px-6 text-sm font-medium transition-colors"
            >
              {primaryCta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="border-border bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>

          {trustSignals && trustSignals.length > 0 && (
            <ul className="text-muted-foreground mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              {trustSignals.map((signal, i) => (
                <li key={signal} className="flex items-center gap-x-5">
                  {i > 0 && <span aria-hidden>·</span>}
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="order-first lg:order-none">
          <div className="mx-auto flex items-center justify-center">
            {illustration ?? <HeroIllustration />}
          </div>
        </div>
      </div>
    </section>
  );
}
