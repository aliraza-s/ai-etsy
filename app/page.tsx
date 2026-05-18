import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Craftly";

export default function HomePage() {
  return (
    <div className="relative isolate">
      <div
        aria-hidden
        className="from-primary/10 via-background to-accent/5 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br"
      />

      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-24 text-center sm:px-6 lg:px-8 lg:pt-28">
        <span className="bg-secondary text-secondary-foreground ring-border mb-6 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1">
          <span className="bg-primary mr-2 h-1.5 w-1.5 animate-pulse rounded-full" />
          Phase 0 — local scaffold
        </span>

        <h1 className="text-foreground max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          AI tools for Etsy sellers that{" "}
          <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
            paste, generate, rank
          </span>
        </h1>

        <p className="text-muted-foreground mt-6 max-w-2xl text-lg text-balance">
          {APP_NAME} writes high-ranking tags, titles, keywords, and descriptions — and audits your
          listings and shop — in seconds. No Etsy API. No scraping. Just paste and go.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-colors"
          >
            Start free
          </Link>
          <Link
            href="/tools"
            className="border-border bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition-colors"
          >
            See the tools
          </Link>
        </div>

        <ul className="text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
          <li>No credit card required</li>
          <li aria-hidden>·</li>
          <li>Free tools, no signup</li>
          <li aria-hidden>·</li>
          <li>AI-powered by Claude &amp; Qwen</li>
          <li aria-hidden>·</li>
          <li>Cancel anytime</li>
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="border-border bg-card text-card-foreground rounded-xl border p-8 shadow-sm">
          <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
            scaffold status
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Phase 0 complete. Phase 1 next.
          </h2>
          <p className="text-muted-foreground mt-3 max-w-prose text-sm">
            This placeholder confirms Next.js, Tailwind v4, theme tokens, dark/light mode, and the
            Inter + JetBrains Mono font stack are wired correctly. Phase 1 adds Prisma, Postgres,
            Auth.js v5, and the app shell. Phase 2 builds the real landing page with Lottie hero and
            full SEO structure.
          </p>
        </div>
      </section>
    </div>
  );
}
