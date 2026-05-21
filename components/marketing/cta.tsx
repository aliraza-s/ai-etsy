import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export interface CtaProps {
  title: React.ReactNode;
  body?: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  trustSignals?: string[];
}

export function Cta({ title, body, primary, secondary, trustSignals }: CtaProps) {
  return (
    <div className="border-border from-primary/12 via-card to-accent/8 relative isolate overflow-hidden rounded-3xl border bg-gradient-to-br p-8 text-center shadow-sm sm:p-12">
      {/* Decorative pattern + spotlight */}
      <div
        aria-hidden
        className="dot-pattern pointer-events-none absolute inset-0 -z-10 opacity-50"
      />
      <div aria-hidden className="spotlight pointer-events-none absolute inset-0 -z-10" />

      <span className="border-border/70 bg-card/80 text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur">
        <span className="live-dot" aria-hidden />
        Ready when you are
      </span>

      <h2 className="text-foreground text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {body && (
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm leading-relaxed text-balance sm:text-base">
          {body}
        </p>
      )}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={primary.href}
          className="bg-primary text-primary-foreground hover:bg-primary/90 ring-primary/20 hover:ring-primary/40 inline-flex h-11 items-center justify-center gap-1.5 rounded-md px-6 text-sm font-medium shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          {primary.label}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        {secondary && (
          <Link
            href={secondary.href}
            className="border-border bg-background/70 hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium backdrop-blur transition-colors"
          >
            {secondary.label}
          </Link>
        )}
      </div>
      {trustSignals && trustSignals.length > 0 && (
        <ul className="text-muted-foreground mt-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
          {trustSignals.map((signal) => (
            <li key={signal} className="inline-flex items-center gap-1.5">
              <Check className="text-primary size-3.5" aria-hidden />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
