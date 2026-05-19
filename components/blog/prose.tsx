import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Article body wrapper.
 *
 * Provides consistent type sizing and spacing for the blog. Authors write
 * JSX in `lib/content/blog-posts/<slug>.tsx` using the helpers below; this
 * component sets the visual cadence.
 */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "text-foreground [&_a]:text-primary space-y-5 text-base leading-[1.75] sm:text-lg [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:no-underline [&_strong]:font-semibold",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Body helpers ───────────────────────────────────────────────────────────

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="text-foreground scroll-mt-24 pt-6 text-2xl font-semibold tracking-tight sm:text-3xl"
    >
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="text-foreground scroll-mt-24 pt-4 text-xl font-semibold tracking-tight sm:text-2xl"
    >
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-foreground text-lg leading-relaxed sm:text-xl">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="text-muted-foreground list-disc space-y-2 pl-6 marker:text-current/40">
      {children}
    </ul>
  );
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="text-muted-foreground list-decimal space-y-2 pl-6 marker:font-mono marker:text-current/60">
      {children}
    </ol>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export function Quote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <figure className="border-primary/40 bg-primary/5 rounded-r-lg border-l-4 py-4 pr-5 pl-5">
      <blockquote className="text-foreground text-base leading-relaxed sm:text-lg">
        {children}
      </blockquote>
      {cite && (
        <figcaption className="text-muted-foreground mt-2 font-mono text-xs">— {cite}</figcaption>
      )}
    </figure>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "success";
  title?: string;
  children: ReactNode;
}) {
  const cls =
    tone === "warn"
      ? "border-accent/40 bg-accent/5 text-foreground"
      : tone === "success"
        ? "border-success/40 bg-success/5 text-foreground"
        : "border-primary/40 bg-primary/5 text-foreground";
  return (
    <aside className={cn("rounded-lg border p-5 text-base leading-relaxed", cls)}>
      {title && <p className="text-foreground mb-1.5 text-sm font-semibold">{title}</p>}
      <div className="text-muted-foreground">{children}</div>
    </aside>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-border bg-card rounded-lg border p-5 text-center">
      <p className="text-primary text-3xl font-semibold tabular-nums">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{label}</p>
    </div>
  );
}

export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{children}</div>;
}

export function ToolMention({ slug, label }: { slug: string; label: string }) {
  return (
    <Link
      href={`/tools/${slug}`}
      className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 mr-1 inline-flex h-7 items-center rounded-md border px-2 text-sm transition-colors"
    >
      {label} →
    </Link>
  );
}
