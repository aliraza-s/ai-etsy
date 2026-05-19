import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { JsonLd } from "@/components/marketing/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";

const LAST_UPDATED = "2026-01-15";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses, and protects your personal information. Plain-language explanation of what we store and why.`,
  alternates: { canonical: `${SITE.url}/privacy` },
  openGraph: {
    title: `Privacy Policy — ${SITE.name}`,
    description: `How ${SITE.name} collects, uses, and protects your personal information.`,
    url: `${SITE.url}/privacy`,
    type: "article",
  },
};

const SECTIONS: LegalSection[] = [
  {
    id: "summary",
    heading: "Short summary (the TL;DR)",
    body: (
      <ul className="list-disc space-y-1.5 pl-6">
        <li>
          We collect the minimum needed to sign you in, charge you, and run the AI tools you ask
          for.
        </li>
        <li>We do not sell your data. We do not train AI models on your inputs.</li>
        <li>
          Listing text you submit is sent to our AI providers (Anthropic, OpenRouter, Together AI)
          to fulfill your request. Their data-retention policies apply to that single API call.
        </li>
        <li>You can delete your account at any time from your billing page or by emailing us.</li>
      </ul>
    ),
  },
  {
    id: "data-we-collect",
    heading: "1. What we collect",
    body: (
      <>
        <p>
          <strong>Account data.</strong> Email address, optional name, profile image (Google OAuth
          only), authentication tokens, account creation date.
        </p>
        <p>
          <strong>Billing data.</strong> Plan, subscription status, renewal date, and a payment
          processor reference. We do not store full card numbers — those are held by our payment
          processor (Paddle).
        </p>
        <p>
          <strong>Tool inputs.</strong> The product titles, descriptions, tags, About-section text,
          and similar content you paste into a tool to run it.
        </p>
        <p>
          <strong>Usage data.</strong> Which tools you used, when, the AI provider and model that
          ran, token counts, request duration, success/failure status, and your remaining credit
          balance. We do not log keystrokes or browser content outside the tool input fields.
        </p>
        <p>
          <strong>Cookies and local storage.</strong> A session cookie for authentication, a theme
          preference cookie, and an essential CSRF token. We do not use third-party advertising or
          tracking cookies.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    heading: "2. How we use it",
    body: (
      <>
        <p>We use the data above to:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Authenticate your session, secure your account, and prevent fraud.</li>
          <li>Run the AI tools you request and return results to you.</li>
          <li>Bill you on your chosen plan, refund where applicable, and prevent payment abuse.</li>
          <li>Show you your generation history so you can re-use past output.</li>
          <li>Diagnose errors, measure costs, and improve reliability and performance.</li>
          <li>Send essential service emails (sign-in links, billing receipts, security alerts).</li>
        </ul>
        <p>
          We do not train our own models, fine-tune third-party models on your data, or use your
          inputs to enrich any commercial profile.
        </p>
      </>
    ),
  },
  {
    id: "ai-providers",
    heading: "3. AI providers and outbound data",
    body: (
      <>
        <p>
          When you run a tool, the text you submitted is sent to the configured AI provider for that
          tool — typically Anthropic, OpenRouter, or Together AI — along with a system prompt
          authored by us. Provider choice is set per-tool by our administrators and may change
          without notice for reliability and cost reasons.
        </p>
        <p>
          The provider returns a response that we save in your generation history and display to
          you.
        </p>
        <p>
          Each provider has its own data-retention policy. Anthropic, OpenRouter, and Together AI
          have all publicly stated they do not train on data submitted via paid API calls. We choose
          providers on this basis but we do not control them. You should not submit data through the
          Service that you would not want a third party to briefly process.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    heading: "4. Who we share data with",
    body: (
      <>
        <p>
          We share data with the following categories of service providers only as needed to run the
          Service:
        </p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            AI inference providers (Anthropic, OpenRouter, Together AI) — receive only your tool
            input + the system prompt for that call.
          </li>
          <li>
            Authentication providers (Resend for magic links, Google for OAuth) — receive your email
            address.
          </li>
          <li>
            Payment processor (Paddle) — receives your name, email, country, and billing details
            directly; we never see your card number.
          </li>
          <li>
            Infrastructure (Vercel, our managed Postgres provider) — host the app and database under
            standard cloud agreements.
          </li>
          <li>
            Error monitoring (e.g. Sentry, if enabled) — receives stack traces and request metadata,
            with personally identifying fields scrubbed.
          </li>
        </ul>
        <p>
          We do not sell your personal data and we do not share it with advertising networks. If we
          are required to disclose data by valid legal process, we will limit disclosure to what is
          legally required and, where lawful, notify you first.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    heading: "5. How long we keep data",
    body: (
      <ul className="list-disc space-y-1.5 pl-6">
        <li>
          Account data: kept while the account is active; deleted within 30 days of account deletion
          (some elements may persist longer in encrypted backups for up to 90 days).
        </li>
        <li>
          Generation history: kept while the account is active; you can delete individual
          generations from the History page at any time.
        </li>
        <li>
          Usage logs: kept up to 24 months for cost analysis and abuse prevention, then aggregated
          and anonymized.
        </li>
        <li>
          Billing records: kept for the period required by applicable tax law (typically 6–10
          years).
        </li>
      </ul>
    ),
  },
  {
    id: "security",
    heading: "6. Security",
    body: (
      <>
        <p>
          We implement industry-standard safeguards including TLS in transit, encryption at rest for
          API keys (AES-256-GCM), bcrypt-equivalent strength for any credentials we store,
          principle-of-least-privilege access controls, and access logging on administrative
          endpoints.
        </p>
        <p>
          No system is perfectly secure. If we become aware of a breach that materially affects your
          data, we will notify you within 72 hours of confirming the scope, as required by
          applicable law.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "7. Your rights",
    body: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate data.</li>
          <li>Delete your account and associated data.</li>
          <li>Export your data in a portable format.</li>
          <li>Object to or restrict certain processing.</li>
          <li>Withdraw consent for non-essential processing (we don&apos;t currently do any).</li>
          <li>Lodge a complaint with your local data-protection regulator.</li>
        </ul>
        <p>
          To exercise any of these rights, email us at{" "}
          <code className="font-mono text-sm">privacy@craftly.app</code> from the address tied to
          your account. We respond within 30 days.
        </p>
      </>
    ),
  },
  {
    id: "international",
    heading: "8. International transfers",
    body: (
      <p>
        Our servers and providers may be located outside your country. By using the Service you
        understand that your data may be transferred to and processed in jurisdictions with
        different data-protection laws. We rely on standard contractual clauses or equivalent
        safeguards where required.
      </p>
    ),
  },
  {
    id: "children",
    heading: "9. Children",
    body: (
      <p>
        The Service is not directed to anyone under 18. We do not knowingly collect personal data
        from children. If you believe a child has provided us data, contact us and we will delete
        it.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "10. Changes",
    body: (
      <p>
        We may update this Privacy Policy. Material changes will be announced in-app or by email at
        least 14 days before they take effect. Continued use of the Service after the effective date
        constitutes acceptance.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "11. Contact",
    body: (
      <p>
        Privacy questions? Email <code className="font-mono text-sm">privacy@craftly.app</code> or
        use our{" "}
        <Link href="/contact" className="text-primary hover:underline">
          contact form
        </Link>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Privacy", url: "/privacy" },
        ])}
      />
      <LegalPage
        title="Privacy Policy"
        description={`What ${SITE.name} collects, why, and how to control it. Plain language, no dark patterns.`}
        lastUpdated={LAST_UPDATED}
        sections={SECTIONS}
      />
    </>
  );
}
