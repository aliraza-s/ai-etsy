import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { JsonLd } from "@/components/marketing/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";

const LAST_UPDATED = "2026-01-15";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `${SITE.name}'s refund and cancellation rules. 14-day money-back guarantee on Pro and Max, plus when refunds don't apply.`,
  alternates: { canonical: `${SITE.url}/refund-policy` },
  openGraph: {
    title: `Refund Policy — ${SITE.name}`,
    description: `Refund and cancellation rules for ${SITE.name}.`,
    url: `${SITE.url}/refund-policy`,
    type: "article",
  },
};

const SECTIONS: LegalSection[] = [
  {
    id: "summary",
    heading: "Short summary",
    body: (
      <ul className="list-disc space-y-1.5 pl-6">
        <li>
          <strong>14-day money-back guarantee</strong> on your first paid subscription period (Pro
          or Max, monthly or annual). No questions asked.
        </li>
        <li>
          Cancel any time — access continues through the end of the billing period you already paid
          for.
        </li>
        <li>
          We do not refund partial months for cancellations made after day 14, and we do not refund
          unused credits.
        </li>
      </ul>
    ),
  },
  {
    id: "guarantee",
    heading: "1. The 14-day money-back guarantee",
    body: (
      <>
        <p>
          If {SITE.name} isn&apos;t what you expected, email us at{" "}
          <code className="font-mono text-sm">billing@craftly.app</code> within 14 calendar days of
          your <strong>first</strong> Pro or Max charge — monthly or annual — and we&apos;ll refund
          the full amount.
        </p>
        <p>
          This guarantee applies once per customer. Subsequent renewal payments and plan changes do
          not reset the 14-day window.
        </p>
      </>
    ),
  },
  {
    id: "cancellation",
    heading: "2. How cancellation works",
    body: (
      <>
        <p>
          You can cancel your subscription at any time from your{" "}
          <Link href="/app" className="text-primary hover:underline">
            account billing page
          </Link>{" "}
          (we&apos;ll wire this fully in Phase 4). Cancellation stops the next renewal payment but
          does not refund the current period — you keep paid access through the end of it.
        </p>
        <p>After cancellation:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>You retain access to paid tools until the period end.</li>
          <li>Your account drops to the Free plan, with 15 credits/month restored.</li>
          <li>Your generation history is preserved.</li>
          <li>If you change your mind, you can resubscribe at any time.</li>
        </ul>
      </>
    ),
  },
  {
    id: "when-refunds-dont-apply",
    heading: "3. When refunds don't apply",
    body: (
      <p>
        After the 14-day window, refunds are issued only at our discretion and typically only in the
        event of a billing error, prolonged service outage, or other extraordinary circumstance.
        Specifically, we do not refund:
      </p>
    ),
  },
  {
    id: "specifics",
    heading: "4. Specific scenarios we don't refund",
    body: (
      <ul className="list-disc space-y-1.5 pl-6">
        <li>Unused credits from a current or past billing period.</li>
        <li>Partial months on a monthly plan after day 14.</li>
        <li>Annual subscriptions outside the 14-day initial window.</li>
        <li>
          Disappointment with AI output quality — the Service ships with a free tier so you can
          evaluate output quality before paying.
        </li>
        <li>
          Failure of an AI provider beyond our reasonable control, where we have already failed over
          to a backup model or refunded credits to your account in line with our normal
          abuse-prevention policy.
        </li>
        <li>
          Chargebacks issued without first contacting us — these may result in account closure.
        </li>
      </ul>
    ),
  },
  {
    id: "credit-refunds",
    heading: "5. Automatic credit refunds within a subscription",
    body: (
      <p>
        Separate from paid-subscription refunds: if an AI request fails for a reason on our side
        (provider outage, model rejection, internal error), we automatically refund the credits that
        were reserved for that request to your in-app balance. You don&apos;t need to ask. These are
        not cash refunds.
      </p>
    ),
  },
  {
    id: "how-to-request",
    heading: "6. How to request a refund",
    body: (
      <>
        <p>
          Email us at <code className="font-mono text-sm">billing@craftly.app</code> from the
          address tied to your account, including:
        </p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>The date of the charge.</li>
          <li>The plan you were on (Pro or Max, monthly or annual).</li>
          <li>
            A one-line explanation (optional — &quot;changed my mind&quot; is fine within the 14-day
            window).
          </li>
        </ul>
        <p>
          We respond within two business days and process approved refunds via the original payment
          method within ten business days, subject to your payment provider&apos;s timing.
        </p>
      </>
    ),
  },
  {
    id: "eu-uk-statutory",
    heading: "7. EU / UK statutory withdrawal right",
    body: (
      <p>
        If you are a consumer based in the EU or UK, you have a statutory 14-day right of withdrawal
        from the date of subscription. By beginning to use the Service immediately upon subscribing,
        you expressly request that we begin performance during the withdrawal period and acknowledge
        that you may lose this right once the service is fully provided. Our 14-day money-back
        guarantee above is at least as generous as this statutory minimum.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "8. Contact",
    body: (
      <p>
        Billing or refund question? Email{" "}
        <code className="font-mono text-sm">billing@craftly.app</code> or use our{" "}
        <Link href="/contact" className="text-primary hover:underline">
          contact form
        </Link>
        .
      </p>
    ),
  },
];

export default function RefundPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Refund Policy", url: "/refund-policy" },
        ])}
      />
      <LegalPage
        title="Refund Policy"
        description="14-day money-back guarantee on your first paid period. After that, here's exactly what we will and won't refund."
        lastUpdated={LAST_UPDATED}
        sections={SECTIONS}
      />
    </>
  );
}
