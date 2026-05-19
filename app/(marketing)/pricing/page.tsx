import type { Metadata } from "next";
import { Section, SectionHeader } from "@/components/marketing/section";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";
import { JsonLd } from "@/components/marketing/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { PricingTable } from "./pricing-table";

export const metadata: Metadata = {
  title: "Pricing — Free, Pro, and Max plans",
  description:
    "Craftly pricing: 15 credits/month free, Pro $5.99/mo (200 credits), Max $11.99/mo (600 credits, Claude Sonnet on analyzers). Cancel anytime.",
  alternates: { canonical: `${SITE.url}/pricing` },
};

const FAQ_ITEMS = [
  {
    q: "What is a credit?",
    a: "A credit is one unit of AI usage. Tags and titles cost 1 credit each; keyword research is 2; description generation is 3; listing audits are 5; full shop audits are 8. Free tools (fee calculator, holiday calendar) cost zero.",
  },
  {
    q: "Do credits roll over?",
    a: "No. Credits reset at the start of each billing period — that's how we keep the price flat. Pro and Max plans give you 200 and 600 credits respectively, which covers most sellers' monthly workflow with room to spare.",
  },
  {
    q: "What does Max give me that Pro doesn't?",
    a: "More credits (600 vs 200) and a model upgrade: the Listing Analyzer and Shop Analyzer run on Claude Sonnet 4.6 instead of Claude Haiku 4.5. Sonnet is more thorough and more nuanced — worth it if you depend on the deep audits.",
  },
  {
    q: "Can I switch plans mid-month?",
    a: "Yes. Upgrades take effect immediately and we prorate the difference. Downgrades take effect at the end of your current billing period so you keep what you paid for.",
  },
  {
    q: "Is there a discount for annual?",
    a: "Yes. Annual plans are billed once and save roughly two months vs paying monthly: Pro is $49/year (vs $71.88) and Max is $99/year (vs $143.88). Annual plans also include a 30-day money-back guarantee.",
  },
  {
    q: "How does billing work?",
    a: "Through Paddle, our Merchant of Record. Paddle handles VAT, currency, and invoicing globally. You'll get receipts via email and can manage payment methods from your billing page.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Pricing", url: "/pricing" },
          ]),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <Section>
        <SectionHeader
          eyebrow="Pricing"
          title="Simple, credit-based pricing"
          description="Start free. Upgrade only when you need more credits or the premium analyzer model."
        />
        <div className="mt-12">
          <PricingTable />
        </div>
      </Section>

      <Section className="bg-secondary/30">
        <SectionHeader eyebrow="FAQ" title="Pricing questions, answered" />
        <div className="mx-auto mt-12 max-w-3xl">
          <Faq items={FAQ_ITEMS} />
        </div>
      </Section>

      <Section>
        <Cta
          title="Start with 15 free credits, no card required."
          body="If you outgrow the free plan, Pro and Max are one click away."
          primary={{ href: "/signin", label: "Start free" }}
          trustSignals={[
            "30-day money-back on annual",
            "Cancel anytime",
            "Secure checkout via Paddle",
          ]}
        />
      </Section>
    </>
  );
}
