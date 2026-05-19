import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { JsonLd } from "@/components/marketing/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { SITE } from "@/lib/seo/site";

const LAST_UPDATED = "2026-01-15";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms governing your use of ${SITE.name} — what you can do, what we can do, how either party can end the relationship.`,
  alternates: { canonical: `${SITE.url}/terms` },
  openGraph: {
    title: `Terms of Service — ${SITE.name}`,
    description: `The terms governing your use of ${SITE.name}.`,
    url: `${SITE.url}/terms`,
    type: "article",
  },
};

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "1. Acceptance of terms",
    body: (
      <>
        <p>
          By creating an account, signing in, or using {SITE.name} (the &quot;Service&quot;) you
          agree to these Terms of Service (&quot;Terms&quot;) and to our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          . If you do not agree, do not use the Service.
        </p>
        <p>
          You must be at least 18 years old (or the age of majority in your jurisdiction) to use the
          Service. If you use the Service on behalf of an entity, you represent that you have
          authority to bind that entity to these Terms.
        </p>
      </>
    ),
  },
  {
    id: "the-service",
    heading: "2. What the Service does",
    body: (
      <>
        <p>
          {SITE.name} provides AI-assisted tools for online sellers — including tag, title, keyword,
          and description generators, plus listing and shop audit reports — together with free
          utilities such as a fee calculator and seasonal events calendar. You provide the text you
          want analyzed; we run it through a large language model and return structured output.
        </p>
        <p>
          The Service does not connect to, scrape, or otherwise integrate with the Etsy.com
          marketplace. All inputs are pasted by you. Outputs are suggestions; you remain solely
          responsible for the listings you publish.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    heading: "3. Your account",
    body: (
      <>
        <p>
          You sign in with an email magic link or Google account. You are responsible for keeping
          access to that email or Google account secure. Any activity from your account is your
          responsibility.
        </p>
        <p>
          We may suspend or terminate your account at any time if we believe you have violated these
          Terms, abused the Service, or created risk for us or our other users.
        </p>
      </>
    ),
  },
  {
    id: "credits-and-billing",
    heading: "4. Plans, credits, and billing",
    body: (
      <>
        <p>
          The Service is offered on Free, Pro, and Max plans. Pro and Max are paid subscriptions
          billed monthly or annually through our payment processor. Each plan includes a monthly
          credit allowance that resets on your billing date. Credits do not roll over and have no
          cash value.
        </p>
        <p>
          Prices and credit allowances are shown on our{" "}
          <Link href="/pricing" className="text-primary hover:underline">
            pricing page
          </Link>{" "}
          and may change with at least 30 days&apos; notice for existing subscribers. We do not
          guarantee specific AI models, response times, or output quality, and we may switch the
          underlying provider/model at any time to maintain availability and cost-efficiency.
        </p>
        <p>
          Refunds are handled per our{" "}
          <Link href="/refund-policy" className="text-primary hover:underline">
            Refund Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    heading: "5. Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            Use the Service to generate content that infringes a third party&apos;s intellectual
            property, violates a marketplace&apos;s policies, or breaches any law.
          </li>
          <li>
            Submit content that is illegal, harassing, hateful, sexually explicit involving minors,
            or designed to defraud.
          </li>
          <li>
            Attempt to reverse engineer, scrape, or resell the Service or its outputs as a competing
            AI API.
          </li>
          <li>
            Share account access, automate sign-ups, or use the Service to train another
            machine-learning model.
          </li>
          <li>
            Interfere with the Service, attempt to bypass rate limits or credit metering, or probe
            its security without an authorized scope.
          </li>
        </ul>
        <p>
          Repeated or serious violations will result in suspension and forfeiture of remaining
          credits.
        </p>
      </>
    ),
  },
  {
    id: "ai-disclaimers",
    heading: "6. AI output disclaimers",
    body: (
      <>
        <p>
          The Service uses large language models, which can produce inaccurate, biased, or
          fabricated output. You are responsible for reviewing every output before publishing,
          shipping, pricing, or relying on it commercially.
        </p>
        <p>
          We do not warrant that outputs will rank on any marketplace, improve sales, comply with
          any specific platform&apos;s policies, or be free of errors. Marketplace ranking is
          controlled by the marketplace, not by us.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    heading: "7. Intellectual property",
    body: (
      <>
        <p>
          You retain all rights to the inputs you submit. To the extent permitted by applicable law,
          you also own the outputs we return to you, subject to (a) any rights held by the
          underlying AI provider and (b) the inherent non-uniqueness of AI output (similar inputs
          may produce similar outputs for other customers).
        </p>
        <p>
          The Service itself — the UI, code, branding, documentation, and aggregated analytics — is
          owned by us and protected by copyright and trademark law. You may not use our name, logo,
          or trade dress without written permission.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    heading: "8. Third-party services and trademarks",
    body: (
      <>
        <p>
          The Service relies on third-party providers including, without limitation, Anthropic,
          OpenRouter, Together AI, Resend, Paddle, Google, and Vercel. Their respective terms govern
          how they process the data we send them. We choose providers we believe to be reputable but
          we do not control their availability or policies.
        </p>
        <p>
          {SITE.name} is not affiliated with, endorsed by, or sponsored by Etsy, Inc.
          &quot;Etsy&quot; is a registered trademark of Etsy, Inc. References to Etsy on this site
          are for identification only and are made under fair use.
        </p>
      </>
    ),
  },
  {
    id: "warranty-disclaimer",
    heading: "9. Disclaimer of warranties",
    body: (
      <p>
        The Service is provided <strong>&quot;as is&quot;</strong> and{" "}
        <strong>&quot;as available&quot;</strong> without warranties of any kind, express or
        implied, including without limitation the warranties of merchantability, fitness for a
        particular purpose, or non-infringement. We do not warrant that the Service will be
        uninterrupted, error-free, secure, or free of harmful components.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "10. Limitation of liability",
    body: (
      <p>
        To the maximum extent permitted by law, in no event will {SITE.name}, its affiliates, or its
        suppliers be liable for any indirect, incidental, special, consequential, or punitive
        damages, or any loss of profits, revenues, data, or goodwill, arising out of or in
        connection with your use of the Service. Our aggregate liability for direct damages will not
        exceed the greater of (a) the amount you paid us in the twelve (12) months preceding the
        claim and (b) USD $100.
      </p>
    ),
  },
  {
    id: "indemnity",
    heading: "11. Indemnity",
    body: (
      <p>
        You agree to defend, indemnify, and hold harmless {SITE.name} from any claim, loss,
        liability, or expense (including reasonable attorneys&apos; fees) arising from your inputs,
        your published listings, your violation of these Terms, or your infringement of any third
        party&apos;s rights.
      </p>
    ),
  },
  {
    id: "termination",
    heading: "12. Termination",
    body: (
      <p>
        You may cancel your subscription at any time from your account billing page; access
        continues through the end of the paid period. We may suspend or terminate your access at any
        time with or without notice for any breach of these Terms. Sections that by their nature
        should survive termination (intellectual property, disclaimers, liability, dispute
        resolution) will survive.
      </p>
    ),
  },
  {
    id: "governing-law",
    heading: "13. Governing law and disputes",
    body: (
      <p>
        These Terms are governed by the laws of the jurisdiction in which {SITE.name} is
        established, without regard to its conflict-of-law principles. Any dispute will be resolved
        in the courts of that jurisdiction, except that either party may seek injunctive relief in
        any court of competent jurisdiction to protect intellectual property or confidentiality.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "14. Changes to these Terms",
    body: (
      <p>
        We may update these Terms from time to time. Material changes will be announced via in-app
        notification or email at least 14 days before they take effect. Continued use of the Service
        after the effective date constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "15. Contact",
    body: (
      <p>
        Questions about these Terms? Reach us at{" "}
        <Link href="/contact" className="text-primary hover:underline">
          /contact
        </Link>{" "}
        or by email at <code className="font-mono text-sm">legal@craftly.app</code>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Terms", url: "/terms" },
        ])}
      />
      <LegalPage
        title="Terms of Service"
        description={`The rules of using ${SITE.name}. Read once, refer back when you need to.`}
        lastUpdated={LAST_UPDATED}
        sections={SECTIONS}
      />
    </>
  );
}
