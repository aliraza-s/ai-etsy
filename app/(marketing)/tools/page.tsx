import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/section";
import { Cta } from "@/components/marketing/cta";
import { JsonLd } from "@/components/marketing/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { TOOLS } from "@/lib/content/tools";

export const metadata: Metadata = {
  title: "Etsy seller tools — eight AI-powered tools, two free forever",
  description:
    "All Craftly tools in one place: tag, title, keyword, description generators, listing & shop analyzers, plus free fee calculator and holiday calendar.",
  alternates: { canonical: `${SITE.url}/tools` },
};

const PAID = TOOLS.filter((t) => t.category === "paid");
const FREE = TOOLS.filter((t) => t.category === "free");

export default function ToolsHubPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
        ])}
      />

      <Section>
        <SectionHeader
          eyebrow="All tools"
          title="Etsy seller tools — every workflow, one place"
          description="Six credit-gated AI tools and two free SEO magnets. All paste-based — no Etsy API, no scraping."
        />

        <div className="mt-14">
          <h2 className="text-foreground mb-6 text-xl font-semibold tracking-tight">
            AI-powered tools
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PAID.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-secondary/40 group flex h-full flex-col rounded-xl border p-6 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-md">
                      <tool.icon className="size-5" aria-hidden />
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {tool.credits} {tool.credits === 1 ? "credit" : "credits"}
                    </span>
                  </div>
                  <h3 className="text-foreground mt-4 flex items-center gap-1 text-lg font-semibold">
                    {tool.name}
                    <ArrowUpRight
                      aria-hidden
                      className="text-muted-foreground group-hover:text-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {tool.tagline}
                  </p>
                  {tool.model && (
                    <p className="text-muted-foreground mt-auto pt-4 font-mono text-[11px] tracking-wider uppercase">
                      {tool.model}
                      {tool.maxBoost && <span className="text-accent"> · Sonnet on Max</span>}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16">
          <h2 className="text-foreground mb-6 text-xl font-semibold tracking-tight">
            Free tools — no signup, no credit card
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {FREE.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="border-accent/30 bg-accent/5 text-card-foreground hover:border-accent/60 group flex h-full flex-col rounded-xl border p-6 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-accent/15 text-accent-foreground inline-flex size-10 items-center justify-center rounded-md">
                      <tool.icon className="size-5" aria-hidden />
                    </span>
                    <span className="bg-accent/15 text-accent-foreground rounded px-2 py-0.5 font-mono text-xs">
                      FREE
                    </span>
                  </div>
                  <h3 className="text-foreground mt-4 flex items-center gap-1 text-lg font-semibold">
                    {tool.name}
                    <ArrowUpRight
                      aria-hidden
                      className="text-muted-foreground group-hover:text-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {tool.tagline}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <Cta
          title="Ready to optimize every listing?"
          body="Sign up free, paste your first listing, and let Craftly fill the tags for you."
          primary={{ href: "/signin", label: "Start free" }}
          secondary={{ href: "/pricing", label: "Compare plans" }}
          trustSignals={["No credit card", "15 credits/month free", "Cancel anytime"]}
        />
      </Section>
    </>
  );
}
