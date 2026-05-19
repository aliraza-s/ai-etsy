import Link from "next/link";

export interface LegalSection {
  id: string;
  heading: string;
  body: React.ReactNode;
}

/**
 * Shared layout for /terms, /privacy, /refund-policy.
 *
 * Sticky table-of-contents on lg+ viewports (linked to section anchors),
 * stacked content with semantic <section> per item, and a last-updated stamp.
 */
export function LegalPage({
  title,
  description,
  lastUpdated,
  sections,
}: {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-primary font-mono text-xs font-medium tracking-wider uppercase">Legal</p>
        <h1 className="text-foreground mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-4 text-base sm:text-lg">{description}</p>
        <p className="text-muted-foreground mt-3 font-mono text-xs">
          Last updated: <time dateTime={lastUpdated}>{lastUpdated}</time>
        </p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-muted-foreground mb-3 font-mono text-[10px] font-medium tracking-wider uppercase">
            On this page
          </p>
          <nav>
            <ul className="space-y-1.5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`#${s.id}`}
                    className="text-muted-foreground hover:text-foreground block transition-colors"
                  >
                    {s.heading}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                {s.heading}
              </h2>
              <div className="text-muted-foreground prose-content mt-3 space-y-4 text-base leading-relaxed">
                {s.body}
              </div>
            </section>
          ))}

          <footer className="border-border/60 text-muted-foreground border-t pt-6 text-sm">
            <p>
              Questions about this document?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact us
              </Link>
              .
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
