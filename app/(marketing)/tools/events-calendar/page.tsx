import type { Metadata } from "next";
import { ToolMarketingSections } from "@/components/marketing/tool-marketing-sections";
import { Section } from "@/components/marketing/section";
import { JsonLd } from "@/components/marketing/json-ld";
import { EventsCalendar } from "@/components/tools/events-calendar";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  softwareApplicationSchema,
} from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { TOOL_BY_SLUG } from "@/lib/content/tools";
import { TOOL_PAGES, fallbackToolContent } from "@/lib/content/tool-pages";

const TOOL = TOOL_BY_SLUG["events-calendar"];
const CONTENT = TOOL_PAGES["events-calendar"] ?? fallbackToolContent(TOOL.name);

export const metadata: Metadata = {
  title: TOOL.heroTitle,
  description: CONTENT.metaDescription,
  alternates: { canonical: `${SITE.url}/tools/events-calendar` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/tools/events-calendar`,
    title: TOOL.heroTitle,
    description: CONTENT.metaDescription,
    siteName: SITE.name,
  },
};

export default function EventsCalendarPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: TOOL.name,
            description: CONTENT.metaDescription,
            url: `${SITE.url}/tools/events-calendar`,
            price: "0",
          }),
          faqSchema(CONTENT.faq),
          howToSchema(
            CONTENT.steps.map((s) => ({ name: s.title, text: s.body })),
            "How to use the Etsy Events Calendar",
          ),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tools", url: "/tools" },
            { name: TOOL.name, url: "/tools/events-calendar" },
          ]),
        ]}
      />

      <section className="relative isolate overflow-hidden pt-16 pb-8 sm:pt-20 lg:pt-24">
        <div
          aria-hidden
          className="from-primary/10 via-background to-accent/5 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="bg-accent/15 text-accent-foreground ring-accent/30 mb-5 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1">
              <span className="bg-accent mr-2 h-1.5 w-1.5 rounded-full" />
              Free forever · no signup
            </span>
            <h1 className="text-foreground text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl">
              {TOOL.heroTitle}
            </h1>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm text-balance sm:text-base">
              {CONTENT.tldr}
            </p>
          </div>
        </div>
      </section>

      <Section className="pt-2 pb-8">
        <EventsCalendar />
      </Section>

      <Section className="py-6">
        <div className="border-border bg-secondary/30 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-lg border-y px-4 py-3 text-xs">
          <a
            href="#what-is"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            What this calendar covers
          </a>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How sellers use it
          </a>
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
            Seasonal FAQ
          </a>
        </div>
      </Section>

      <div id="what-is" />
      <ToolMarketingSections tool={TOOL} content={CONTENT} />
    </>
  );
}
