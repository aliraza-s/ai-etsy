import type { Metadata } from "next";
import { Mail, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { Section, SectionHeader } from "@/components/marketing/section";
import { Faq } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach the ${SITE.name} team. We answer every message — billing, bug reports, product feedback, partnership requests. Reply usually within 24 hours.`,
  alternates: { canonical: `${SITE.url}/contact` },
  openGraph: {
    title: `Contact ${SITE.name}`,
    description: `Reach the ${SITE.name} team. Reply usually within 24 hours.`,
    url: `${SITE.url}/contact`,
    type: "article",
  },
};

const CHANNELS = [
  {
    icon: Mail,
    label: "General",
    value: "hello@craftly.app",
    note: "Product questions, bug reports, general feedback.",
  },
  {
    icon: ShieldCheck,
    label: "Billing",
    value: "billing@craftly.app",
    note: "Refunds, invoices, plan changes.",
  },
  {
    icon: MessageCircle,
    label: "Privacy / legal",
    value: "privacy@craftly.app",
    note: "Data requests, GDPR, abuse reports.",
  },
] as const;

const FAQ_ITEMS = [
  {
    q: "How fast do you reply?",
    a: "Most messages get a real human reply within one business day. Refund requests are typically processed within two business days. We don't have a chatbot.",
  },
  {
    q: "Should I include screenshots or example output?",
    a: "Yes, please. If you're reporting a bug or quality issue, the more context the better — paste the input you used, the output you got, and what you expected. It saves a back-and-forth.",
  },
  {
    q: "Do you offer custom plans for larger sellers?",
    a: "If our Max plan (600 credits/month) isn't enough, email us. We can negotiate higher-volume plans, but we're a small team — please give us context on your use case so we can size it right.",
  },
  {
    q: "Can I request a new tool or feature?",
    a: "Absolutely — the roadmap is heavily shaped by feedback. Describe the workflow you wish existed and we'll let you know whether/when we plan to build it.",
  },
  {
    q: "Can I report a security issue?",
    a: "Yes. Email security@craftly.app with a clear description and reproduction steps. We'll acknowledge within 24 hours and won't pursue legal action against good-faith research that respects user data.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
          faqSchema(FAQ_ITEMS),
        ]}
      />

      <Section className="pt-12 pb-6 sm:pt-16 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-primary font-mono text-xs font-medium tracking-wider uppercase">
            Contact
          </p>
          <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            <span className="text-gradient">We read every message.</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            A real human replies, usually within 24 hours. Bug reports, feature ideas, partnership
            asks, refund requests — all welcome.
          </p>
        </div>
      </Section>

      <Section className="py-8 sm:py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="border-border bg-card text-card-foreground rounded-2xl border p-6 sm:p-8">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              Send us a message
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              We&apos;ll get back to you at the email you provide.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-primary font-mono text-xs font-medium tracking-wider uppercase">
                Direct email
              </p>
              <ul className="mt-3 space-y-3">
                {CHANNELS.map((c) => (
                  <li key={c.value} className="border-border bg-card rounded-xl border p-4">
                    <div className="flex items-center gap-2">
                      <c.icon className="text-primary size-4" aria-hidden />
                      <span className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                        {c.label}
                      </span>
                    </div>
                    <a
                      href={`mailto:${c.value}`}
                      className="text-foreground hover:text-primary mt-1.5 block font-mono text-sm transition-colors"
                    >
                      {c.value}
                    </a>
                    <p className="text-muted-foreground mt-1 text-xs">{c.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-border bg-card rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <Clock className="text-primary size-4" aria-hidden />
                <p className="text-foreground text-sm font-semibold">Response time</p>
              </div>
              <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                Typical reply: <strong>under 24 hours</strong>, Monday–Friday. Refunds are usually
                processed within two business days. Security reports get a same-day acknowledgement.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-12 sm:py-16">
        <SectionHeader eyebrow="Before you write" title="Common questions, answered" />
        <div className="mt-12">
          <Faq items={FAQ_ITEMS} />
        </div>
      </Section>
    </>
  );
}
