import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Sparkles, Eye, Lock, Wrench, Compass, ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/section";
import { Cta } from "@/components/marketing/cta";
import { Faq } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: `About ${SITE.name}`,
  description: `${SITE.name} is a small team building AI-assisted tools for Etsy sellers — paste-based, privacy-first, priced honestly. Here's who we are and why we built it.`,
  alternates: { canonical: `${SITE.url}/about` },
  openGraph: {
    title: `About ${SITE.name}`,
    description: `${SITE.name} is a small team building AI-assisted tools for Etsy sellers.`,
    url: `${SITE.url}/about`,
    type: "article",
  },
};

const VALUES: { icon: typeof ShieldCheck; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Privacy by design",
    body: "We never scrape Etsy. We don't ask for your shop login. You paste the text you want optimized, we run it through the AI, and we hand back results. That's the whole flow.",
  },
  {
    icon: Eye,
    title: "Transparent pricing",
    body: 'Credit costs are listed on every tool page. No surprise overages, no hidden "AI surcharge." Annual plans save you ~30% versus monthly, and our 14-day money-back guarantee makes trying it risk-free.',
  },
  {
    icon: Lock,
    title: "No training on your data",
    body: "Inputs go to our AI provider for a single call and come back. We don't fine-tune models on your listings. We don't sell your data. We don't share it with ad networks.",
  },
  {
    icon: Wrench,
    title: "Built to be repaired",
    body: "If a result is wrong, we want to know. If the cost is high, we'll switch the model. If a feature is missing, the founders read every contact-form submission.",
  },
];

const MILESTONES: { date: string; title: string; body: string }[] = [
  {
    date: "Q4 2025",
    title: "First prototype",
    body: "Two engineers, one weekend, a single ‘generate 13 tags from a product title’ endpoint. The first 50 listings it touched in beta saw double-digit lift in views over the following 14 days.",
  },
  {
    date: "Q1 2026",
    title: "Public launch",
    body: "Six AI tools (tag, title, keyword, description, listing audit, shop audit) plus two free tools (fee calculator and seasonal events calendar). Three pricing tiers including a free plan with 15 credits/month.",
  },
  {
    date: "Now",
    title: "What we're working on",
    body: "Bulk operations, a niche-research tool, and an MDX-powered seller-marketing blog. The roadmap is informed by every contact-form note we receive — so write to us.",
  },
];

const FAQ_ITEMS = [
  {
    q: `Who built ${SITE.name}?`,
    a: `A small independent team of AI engineers who run small e-commerce shops in their spare time. We built the tooling we wished existed — there's no venture-capital pressure to ship paywalled noise, and no Etsy partnership to compromise on our advice.`,
  },
  {
    q: `Are you affiliated with Etsy?`,
    a: `No. ${SITE.name} is not affiliated with, endorsed by, or sponsored by Etsy, Inc. "Etsy" is a registered trademark of Etsy, Inc.; we reference the platform on this site solely for identification under fair use. We have no contractual relationship with Etsy and no access to the Etsy API.`,
  },
  {
    q: `Why not just use ChatGPT?`,
    a: `You absolutely can. The difference is structure: every ${SITE.name} tool is a single click, returns a typed, validated output (e.g. exactly 13 tags, each ≤20 characters, deduplicated), and includes Etsy-specific constraints (140-char title limit, multi-word tag preference, tag-character economy). With ChatGPT you re-engineer those constraints in the prompt every single run.`,
  },
  {
    q: `Which AI models do you use?`,
    a: `Qwen 2.5 7B/32B via OpenRouter for the lightweight generators (tags, titles, keywords, descriptions). Claude Haiku 4.5 for the analyzers. Max-tier subscribers get an automatic boost to Claude Sonnet 4.6 on the analyzer tools, which produces noticeably more nuanced recommendations.`,
  },
  {
    q: `What happens to my text after I submit it?`,
    a: `It goes to our configured AI provider (Anthropic, OpenRouter, or Together AI) as a single API call. The response is saved to your generation history so you can copy it again later, and you can delete any generation from your History page. We do not train models on your inputs. Full details in our Privacy Policy.`,
  },
  {
    q: `Do you have an affiliate program or refer-a-friend?`,
    a: `Not yet. We want to nail the core product first. If you'd be interested in helping us build one, write us via the contact form.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
          ]),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <Section className="pt-16 pb-8 sm:pt-20 lg:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-primary font-mono text-xs font-medium tracking-wider uppercase">
            About {SITE.name}
          </p>
          <h1 className="text-foreground mt-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            We make the boring parts of selling fast — so you can keep making the things.
          </h1>
          <p className="text-muted-foreground mt-6 text-lg text-balance">
            {SITE.name} is an independent team of AI engineers and small-shop sellers. We build the
            tools we wished existed when we were squinting at our own listings at 2 a.m. wondering
            why nobody was finding them.
          </p>
        </div>
      </Section>

      <Section className="py-12 sm:py-16">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-24">
            <p className="text-primary font-mono text-xs font-medium tracking-wider uppercase">
              The story
            </p>
            <h2 className="text-foreground mt-2 text-3xl font-semibold tracking-tight">
              Built by sellers, for sellers
            </h2>
          </div>
          <div className="text-muted-foreground space-y-5 text-base leading-relaxed sm:text-lg">
            <p>
              We started where most sellers do — staring at a blank title field, a 13-tag form with
              twelve generic guesses, and a description that read like a spec sheet. We knew Etsy
              search rewarded specificity. We knew shoppers scanned listings in seconds. We knew Q4
              was coming and our shops were not ready.
            </p>
            <p>
              The existing tools were either thin keyword scrapers built on outdated Etsy data, or
              generic ChatGPT wrappers that hadn&apos;t read the Etsy Seller Handbook. Neither
              respected the actual constraints — 140-char titles with weighted-first prefixes,
              multi-word tags ≤20 characters, the way Etsy&apos;s relevance signals weight
              specificity over volume.
            </p>
            <p>
              So we built {SITE.name}. Six AI tools shaped by the actual rules of the marketplace,
              two free utilities that genuinely help (fees, seasonality), and pricing that
              doesn&apos;t penalize you for using the product you&apos;re paying for.
            </p>
            <p>
              We don&apos;t scrape Etsy. We don&apos;t need your shop login. We have no Etsy
              partnership to defend and no investor pressure to ship paywalled features that
              don&apos;t actually move listings. The roadmap is whatever helps small sellers most.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="What we believe"
          title="Four principles, one product"
          description="These are the calls we've made — and the ones we'll keep making."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="border-border bg-card rounded-xl border p-6">
              <span className="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-md">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="text-foreground mt-4 text-lg font-semibold">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="py-12 sm:py-16">
        <SectionHeader
          eyebrow="Where we are"
          title="A short timeline"
          description="From weekend prototype to public product. Still very early."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {MILESTONES.map((m, i) => (
            <li key={m.date} className="border-border bg-card relative rounded-xl border p-6">
              <span className="text-primary font-mono text-xs font-medium tracking-wider uppercase">
                {m.date}
              </span>
              <h3 className="text-foreground mt-2 text-lg font-semibold">{m.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{m.body}</p>
              <span
                aria-hidden
                className="text-muted-foreground/40 absolute top-4 right-4 font-mono text-2xl font-semibold tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="py-12 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="bg-accent/10 text-accent-foreground inline-flex size-10 items-center justify-center rounded-md">
              <Compass className="size-5" aria-hidden />
            </span>
            <h2 className="text-foreground mt-4 text-3xl font-semibold tracking-tight">
              Where we&apos;re heading
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
              The next chunk of work is about <strong>scale and specificity</strong>: bulk
              operations so you can audit 50 listings at once, a niche-finder that surfaces
              underserved keyword clusters, and a marketing blog that doesn&apos;t insult your
              intelligence. Each is informed by the contact-form notes we get — keep them coming.
            </p>
            <Link
              href="/tools"
              className="text-primary mt-6 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              See the current toolkit <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="border-border bg-card text-card-foreground rounded-xl border p-6">
            <p className="text-primary font-mono text-xs font-medium tracking-wider uppercase">
              How we operate
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              <Bullet>
                <strong>One product, focused.</strong> No half-finished side modules. We&apos;d
                rather ship six great tools than thirty mediocre ones.
              </Bullet>
              <Bullet>
                <strong>Public changelog.</strong> Every release is documented in human-readable
                language, not marketing speak.
              </Bullet>
              <Bullet>
                <strong>Reachable founders.</strong> Email{" "}
                <code className="font-mono text-xs">hello@craftly.app</code> — a real person
                replies, usually within 24 hours.
              </Bullet>
              <Bullet>
                <strong>Honest defaults.</strong> Annual plans are cheaper because we want long-term
                fits, not churned trials.
              </Bullet>
            </ul>
          </div>
        </div>
      </Section>

      <Section className="py-12 sm:py-16">
        <SectionHeader eyebrow="Common questions" title="About the team and the product" />
        <div className="mt-12">
          <Faq items={FAQ_ITEMS} />
        </div>
      </Section>

      <Section className="py-12 sm:py-16">
        <Cta
          title={
            <>
              Try the toolkit
              <br className="hidden sm:block" /> on a real listing
            </>
          }
          body="15 free credits a month, no credit card. Drop in a product title and watch the tags land in under ten seconds."
          primary={{ href: "/signin", label: "Get started — it's free" }}
          secondary={{ href: "/pricing", label: "See pricing" }}
          trustSignals={["No Etsy API", "No card required", "Cancel any time", "14-day money-back"]}
        />
      </Section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-foreground flex items-start gap-2">
      <Sparkles className="text-primary mt-0.5 size-4 flex-none" aria-hidden />
      <span>{children}</span>
    </li>
  );
}
