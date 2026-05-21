import type { ReactNode } from "react";

export interface Citation {
  /** Pre-formatted text including source and year, e.g. "Etsy, Q3 2024 10-Q". */
  source: string;
  /** Optional URL. */
  href?: string;
}

export interface DefinitionBlockProps {
  /** H2 phrased as a question or "X: definition" pattern for AEO. */
  heading: string;
  /** Definition paragraph — first sentence is the direct answer. */
  definition: ReactNode;
  /** 2-3 citable facts shown as a stat row. */
  stats: { value: string; label: string; citation?: Citation }[];
}

export function DefinitionBlock({ heading, definition, stats }: DefinitionBlockProps) {
  return (
    <div className="border-border bg-card text-card-foreground relative isolate mx-auto max-w-4xl overflow-hidden rounded-2xl border p-8 shadow-sm sm:p-10">
      <div
        aria-hidden
        className="dot-pattern pointer-events-none absolute inset-0 -z-10 opacity-40"
      />
      <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
        {heading}
      </h2>
      <p className="text-muted-foreground mt-3 text-base leading-relaxed">{definition}</p>

      <dl className="border-border/60 mt-8 grid grid-cols-1 gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="relative">
            <dt className="text-primary font-mono text-[11px] font-medium tracking-wider uppercase">
              {stat.label}
            </dt>
            <dd className="text-foreground mt-1 text-2xl font-semibold tabular-nums sm:text-3xl">
              {stat.value}
            </dd>
            {stat.citation && (
              <p className="text-muted-foreground mt-1 text-xs">
                Source:{" "}
                {stat.citation.href ? (
                  <a
                    href={stat.citation.href}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="hover:text-foreground underline underline-offset-2"
                  >
                    {stat.citation.source}
                  </a>
                ) : (
                  stat.citation.source
                )}
              </p>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
