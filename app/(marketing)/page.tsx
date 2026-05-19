import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, Gauge, Sticker, LineChart, Wand2 } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { DefinitionBlock } from "@/components/marketing/definition-block";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";
import { JsonLd } from "@/components/marketing/json-ld";
import { faqSchema, softwareApplicationSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { TOOLS } from "@/lib/content/tools";

export const metadata: Metadata = {
  title: `${SITE.name} — AI tools for Etsy sellers`,
  description:
    "AI tools for Etsy sellers: tag, title, keyword, and description generators plus listing and shop analyzers. Free fee calculator and holiday calendar included. No Etsy API.",
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    url: SITE.url,
    title: `${SITE.name} — AI tools for Etsy sellers`,
    description:
      "AI tools for Etsy sellers: tag, title, keyword, and description generators plus listing and shop analyzers.",
    siteName: SITE.name,
  },
};

const FEATURES = [
  {
    icon: Wand2,
    title: "Generators that match Etsy search",
    body: "Tags, titles, keywords, and descriptions tuned for Etsy's algorithm — not generic SEO.",
  },
  {
    icon: Sticker,
    title: "13 tags in one click",
    body: "Fill every Etsy tag slot with high-search, low-competition multi-word phrases.",
  },
  {
    icon: LineChart,
    title: "Listing & shop audits",
    body: "Deep AI reviews powered by Claude. Score, fixes, and quick wins, all explained.",
  },
  {
    icon: Gauge,
    title: "Results in under 10 seconds",
    body: "No round-tripping with ChatGPT and no prompt engineering. Just paste and go.",
  },
  {
    icon: ShieldCheck,
    title: "No Etsy API, no scraping",
    body: "You paste, we process. Your shop data never leaves your hands without your say-so.",
  },
  {
    icon: Sparkles,
    title: "Free forever tools",
    body: "Etsy fee calculator and holiday/events calendar — no signup, no credit card.",
  },
];

const FAQ_ITEMS = [
  {
    q: "What are AI tools for Etsy sellers?",
    a: "AI tools for Etsy sellers are software that uses large language models to generate, rewrite, or audit Etsy listing content — typically tags, titles, descriptions, and shop copy. Unlike generic SEO tools, Etsy-specific AI tools understand Etsy's 13-tag limit, 140-character title rule, and ranking quirks. Craftly bundles eight such tools, six powered by Qwen and Claude models behind a credit system.",
  },
  {
    q: "Do you use the Etsy API?",
    a: "No. Etsy's API has strict terms, low rate limits, and unpredictable approval. Craftly is built on a paste-and-go model: you copy a title, description, or shop URL into the tool, the AI processes it, and you copy results back to Etsy. This also means we never scrape etsy.com — Etsy's terms forbid that and we won't put your business at risk.",
  },
  {
    q: "Is Craftly affiliated with Etsy?",
    a: 'No. Craftly is an independent product built by sellers for sellers. "Etsy" is a trademark of Etsy, Inc., used here only to describe what the tools are for. We are not endorsed, sponsored by, or affiliated with Etsy in any way.',
  },
  {
    q: "How does the free plan work?",
    a: "Sign up with no credit card and get 15 credits per month. Tag and title generation cost 1 credit each, so a free plan covers ~15 listings of basic tag and title rewrites per month. The Etsy Fee Calculator and Holiday Calendar are 100% free with no signup at all.",
  },
  {
    q: "Which AI models do you use?",
    a: "Tag and title generators run on Qwen 7B; keyword and description generators on Qwen 32B (both via OpenRouter). The deeper Listing Analyzer and Shop Analyzer run on Anthropic's Claude Haiku 4.5. Max-tier subscribers get Claude Sonnet 4.6 on the analyzers — the same model used for high-stakes reasoning.",
  },
  {
    q: "Will Etsy ban me for using AI-generated tags or descriptions?",
    a: "No. Etsy's policies prohibit reselling and misrepresenting handmade items, not using software to optimize your listings. Craftly generates suggestions you copy into your own listings; you remain in full control of what goes live.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Subscriptions are billed monthly or annually through Paddle (our Merchant of Record). Cancel from your billing page at any time — you keep access until the end of the period. Annual plans include a 30-day money-back guarantee.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Listing content you paste is sent to the AI provider, processed, and returned. We log usage (tokens, cost, duration) for billing accuracy, and store your inputs/outputs in your private history so you can revisit past generations. We never share or sell your data and never train models on it.",
  },
];

const PAID_TOOLS = TOOLS.filter((t) => t.category === "paid");
const FREE_TOOLS = TOOLS.filter((t) => t.category === "free");

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: SITE.name,
            description: SITE.description,
            url: SITE.url,
          }),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <Hero
        eyebrow="AI tools for Etsy sellers"
        title={
          <>
            AI tools for Etsy sellers that{" "}
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
              paste, generate, rank
            </span>
          </>
        }
        tldr={`${SITE.name} writes high-ranking tags, titles, keywords, and descriptions — and audits your listings and shops — in seconds. No Etsy API. No scraping. Just paste and go.`}
        primaryCta={{ href: "/signin", label: "Start free" }}
        secondaryCta={{ href: "/tools", label: "See the tools" }}
        trustSignals={[
          "No credit card required",
          "Free tools, no signup",
          "AI-powered by Claude & Qwen",
          "Cancel anytime",
        ]}
      />

      <TrustStrip />

      <Section>
        <DefinitionBlock
          heading="What are AI tools for Etsy sellers?"
          definition={
            <>
              AI tools for Etsy sellers are software that uses large language models — like Claude
              and Qwen — to generate, rewrite, or audit Etsy listing content (tags, titles,
              descriptions, and shop copy). They differ from generic SEO writers by knowing
              Etsy&apos;s 13-tag limit, 140-character title cap, and ranking quirks. {SITE.name}{" "}
              bundles eight such tools, six gated by a credit system and two free forever.
            </>
          }
          stats={[
            {
              value: "96.3M",
              label: "Active Etsy buyers",
              citation: { source: "Etsy, Q3 2024 10-Q" },
            },
            {
              value: "9M+",
              label: "Active Etsy sellers",
              citation: { source: "Etsy, Q3 2024 10-Q" },
            },
            {
              value: "13",
              label: "Tag slots per listing",
              citation: { source: "Etsy Seller Handbook" },
            },
          ]}
        />
      </Section>

      <Section className="bg-secondary/30">
        <SectionHeader
          eyebrow="How it works"
          title="From paste to publish in three steps"
          description="No prompt engineering, no spreadsheets, no copy-paste juggling with ChatGPT."
        />
        <div className="mt-12 sm:mt-16">
          <HowItWorks />
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Eight tools, one workflow"
          title="Everything an Etsy seller actually needs"
          description="Six AI-powered tools gated by credits, two free SEO magnets — all sharing the same paste-based interface."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PAID_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-secondary/40 group flex flex-col gap-2 rounded-xl border p-5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="bg-primary/10 text-primary inline-flex size-9 items-center justify-center rounded-md">
                  <tool.icon className="size-4" aria-hidden />
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  {tool.credits} {tool.credits === 1 ? "credit" : "credits"}
                </span>
              </div>
              <h3 className="text-foreground mt-2 text-base font-semibold">{tool.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{tool.tagline}</p>
            </Link>
          ))}
          {FREE_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="border-accent/30 bg-accent/5 text-card-foreground hover:border-accent/60 group flex flex-col gap-2 rounded-xl border p-5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="bg-accent/15 text-accent-foreground inline-flex size-9 items-center justify-center rounded-md">
                  <tool.icon className="size-4" aria-hidden />
                </span>
                <span className="bg-accent/15 text-accent-foreground rounded px-2 py-0.5 font-mono text-xs">
                  FREE
                </span>
              </div>
              <h3 className="text-foreground mt-2 text-base font-semibold">{tool.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{tool.tagline}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={`Why ${SITE.name}`}
          title="Built for Etsy, not retrofitted from generic SEO"
          description="Every tool understands Etsy's specific limits, ranking signals, and buyer behavior."
        />
        <div className="mt-12">
          <FeatureGrid features={FEATURES} />
        </div>
      </Section>

      <Section className="bg-secondary/30">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="The short answers. Click any tool for a deeper FAQ on that page."
        />
        <div className="mx-auto mt-12 max-w-3xl">
          <Faq items={FAQ_ITEMS} />
        </div>
      </Section>

      <Section>
        <Cta
          title={
            <>
              Try {SITE.name} free. <br className="hidden sm:block" />
              15 credits per month, no card required.
            </>
          }
          body="Sign in, paste a listing, and watch your tags rewrite themselves. If you don't love it, you don't pay — there's nothing to cancel on the free plan."
          primary={{ href: "/signin", label: "Start free" }}
          secondary={{ href: "/pricing", label: "See pricing" }}
          trustSignals={["No credit card", "Free tools, no signup", "Cancel anytime"]}
        />
      </Section>
    </>
  );
}
