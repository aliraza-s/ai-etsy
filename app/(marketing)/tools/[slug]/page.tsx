import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/marketing/hero";
import { ToolMarketingSections } from "@/components/marketing/tool-marketing-sections";
import { JsonLd } from "@/components/marketing/json-ld";
import { HeroIllustration } from "@/components/illustrations/hero-illustration";
import {
  NicheIllustration,
  CalculatorIllustration,
  CalendarIllustration,
} from "@/components/illustrations/page-illustrations";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  softwareApplicationSchema,
} from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { TOOLS, TOOL_BY_SLUG, type ToolSlug } from "@/lib/content/tools";
import { TOOL_PAGES, fallbackToolContent } from "@/lib/content/tool-pages";

/**
 * Dynamic catch-all for the 6 paid tool marketing pages.
 *
 * The two free tools (`fee-calculator`, `events-calendar`) have their own static
 * routes — those take priority over this dynamic route in Next.js routing.
 */
export function generateStaticParams() {
  return TOOLS.filter((t) => t.category === "paid").map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOL_BY_SLUG[slug as ToolSlug];
  if (!tool) return {};
  const content = TOOL_PAGES[tool.slug] ?? fallbackToolContent(tool.name);
  const canonical = `${SITE.url}/tools/${tool.slug}`;
  return {
    title: tool.heroTitle,
    description: content.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: tool.heroTitle,
      description: content.metaDescription,
      siteName: SITE.name,
    },
  };
}

export default async function ToolMarketingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = TOOL_BY_SLUG[slug as ToolSlug];
  if (!tool) notFound();

  const content = TOOL_PAGES[tool.slug] ?? fallbackToolContent(tool.name);
  const canonical = `${SITE.url}/tools/${tool.slug}`;

  const trustSignals = [
    `${tool.credits} ${tool.credits === 1 ? "credit" : "credits"} per run`,
    "Free plan available",
    tool.model ? `Powered by ${tool.model}` : "AI-powered",
    "Cancel anytime",
  ];

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: tool.name,
            description: content.metaDescription,
            url: canonical,
            price: "5.99",
          }),
          faqSchema(content.faq),
          howToSchema(
            content.steps.map((s) => ({ name: s.title, text: s.body })),
            `How to use the ${tool.name}`,
          ),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tools", url: "/tools" },
            { name: tool.name, url: `/tools/${tool.slug}` },
          ]),
        ]}
      />

      <Hero
        eyebrow={tool.name}
        title={tool.heroTitle}
        tldr={content.tldr}
        primaryCta={{ href: "/signin", label: "Try it free" }}
        secondaryCta={{ href: "/pricing", label: "See pricing" }}
        trustSignals={trustSignals}
        illustration={illustrationFor(tool.slug)}
      />

      <ToolMarketingSections tool={tool} content={content} />
    </>
  );
}

function illustrationFor(slug: ToolSlug) {
  switch (slug) {
    case "niche-finder":
      return <NicheIllustration />;
    case "fee-calculator":
      return <CalculatorIllustration />;
    case "events-calendar":
      return <CalendarIllustration />;
    default:
      return <HeroIllustration />;
  }
}
