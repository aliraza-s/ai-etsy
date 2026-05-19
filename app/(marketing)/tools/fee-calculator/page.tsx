import type { Metadata } from "next";
import { ToolMarketingSections } from "@/components/marketing/tool-marketing-sections";
import { Section } from "@/components/marketing/section";
import { JsonLd } from "@/components/marketing/json-ld";
import { FeeCalculator } from "@/components/tools/fee-calculator";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  softwareApplicationSchema,
} from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { TOOL_BY_SLUG } from "@/lib/content/tools";
import { TOOL_PAGES, fallbackToolContent } from "@/lib/content/tool-pages";

const TOOL = TOOL_BY_SLUG["fee-calculator"];
const CONTENT = TOOL_PAGES["fee-calculator"] ?? fallbackToolContent(TOOL.name);

export const metadata: Metadata = {
  title: TOOL.heroTitle,
  description: CONTENT.metaDescription,
  alternates: { canonical: `${SITE.url}/tools/fee-calculator` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/tools/fee-calculator`,
    title: TOOL.heroTitle,
    description: CONTENT.metaDescription,
    siteName: SITE.name,
  },
};

export default function FeeCalculatorPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: TOOL.name,
            description: CONTENT.metaDescription,
            url: `${SITE.url}/tools/fee-calculator`,
            price: "0",
          }),
          faqSchema(CONTENT.faq),
          howToSchema(
            CONTENT.steps.map((s) => ({ name: s.title, text: s.body })),
            "How to use the Etsy Fee Calculator",
          ),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tools", url: "/tools" },
            { name: TOOL.name, url: "/tools/fee-calculator" },
          ]),
        ]}
      />

      {/* Interactive hero — H1 + TL;DR + live calculator side by side */}
      <section className="relative isolate overflow-hidden pt-16 pb-12 sm:pt-20 lg:pt-24">
        <div
          aria-hidden
          className="from-primary/10 via-background to-accent/5 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-12">
            <div>
              <span className="bg-accent/15 text-accent-foreground ring-accent/30 mb-5 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1">
                <span className="bg-accent mr-2 h-1.5 w-1.5 rounded-full" />
                Free forever · no signup
              </span>
              <h1 className="text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {TOOL.heroTitle}
              </h1>
              <p className="text-muted-foreground mt-5 max-w-md text-base text-balance sm:text-lg">
                {CONTENT.tldr}
              </p>
              <ul className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                <li>Real-time as you type</li>
                <li aria-hidden>·</li>
                <li>US / UK / EU / CA / AU rates</li>
                <li aria-hidden>·</li>
                <li>Updated for 2026</li>
              </ul>
            </div>
            <FeeCalculator />
          </div>
        </div>
      </section>

      {/* Quick anchor — let users jump to context */}
      <Section className="py-6">
        <div className="border-border bg-secondary/30 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-lg border-y px-4 py-3 text-xs">
          <a
            href="#what-is"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            What this calculates
          </a>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
            Etsy fees FAQ
          </a>
        </div>
      </Section>

      {/* Sections need id anchors for the in-page nav above */}
      <div id="what-is" />
      <ToolMarketingSections tool={TOOL} content={CONTENT} />
    </>
  );
}
