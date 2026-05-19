import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface CtaProps {
  title: React.ReactNode;
  body?: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  trustSignals?: string[];
}

export function Cta({ title, body, primary, secondary, trustSignals }: CtaProps) {
  return (
    <div className="border-border from-primary/10 via-card to-accent/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 text-center sm:p-12">
      <h2 className="text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {body && <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-balance">{body}</p>}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={primary.href}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center gap-1.5 rounded-md px-6 text-sm font-medium transition-colors"
        >
          {primary.label}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        {secondary && (
          <Link
            href={secondary.href}
            className="border-border bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors"
          >
            {secondary.label}
          </Link>
        )}
      </div>
      {trustSignals && (
        <p className="text-muted-foreground mt-5 text-xs">{trustSignals.join(" · ")}</p>
      )}
    </div>
  );
}
