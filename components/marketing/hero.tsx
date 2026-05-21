import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
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
  /** Apply gradient ink to the title — modern accent for landing-style heroes. */
  gradientTitle?: boolean;
  /** Optional small "live" badge rendered to the right of the eyebrow text. */
  liveBadge?: string;
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
  gradientTitle,
  liveBadge,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pt-12 pb-16 sm:pt-16 lg:pt-20 lg:pb-20",
        className,
      )}
    >
      {/* Layered ambient background — gradient + spotlight + dot pattern. */}
      <div
        aria-hidden
        className="from-primary/8 via-background to-accent/5 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br"
      />
      <div aria-hidden className="spotlight pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="dot-pattern pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div>
          {eyebrow && (
            <span className="border-border/70 bg-card/60 text-foreground mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
              <span className="live-dot" aria-hidden />
              <span>{eyebrow}</span>
              {liveBadge && (
                <span className="text-primary border-primary/30 bg-primary/5 ml-1 inline-flex items-center rounded-full border px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                  {liveBadge}
                </span>
              )}
            </span>
          )}
          <h1
            className={cn(
              "text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl",
              gradientTitle && "text-gradient",
            )}
          >
            {title}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed text-balance sm:text-lg">
            {tldr}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={primaryCta.href}
              className="bg-primary text-primary-foreground hover:bg-primary/90 ring-primary/20 hover:ring-primary/40 inline-flex h-11 items-center justify-center gap-1.5 rounded-md px-6 text-sm font-medium shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {primaryCta.label}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="border-border bg-background/70 hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium backdrop-blur transition-colors"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>

          {trustSignals && trustSignals.length > 0 && (
            <ul className="text-muted-foreground mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-[13px]">
              {trustSignals.map((signal) => (
                <li key={signal} className="inline-flex items-center gap-1.5">
                  <Check className="text-primary size-3.5" aria-hidden />
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
