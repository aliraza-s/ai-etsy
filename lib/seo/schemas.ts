import { SITE } from "./site";

/** Organization schema — emitted sitewide via root layout. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    legalName: SITE.brand.legalName,
    url: SITE.url,
    foundingDate: SITE.brand.foundingDate,
    logo: `${SITE.url}/logo.png`,
    description: SITE.description,
  };
}

/** WebSite schema with site-search action. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
}

export interface SoftwareSchemaInput {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  price?: string;
  currency?: string;
  aggregateRating?: { ratingValue: number; ratingCount: number };
}

export function softwareApplicationSchema(input: SoftwareSchemaInput) {
  const base = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: input.url,
    applicationCategory: input.applicationCategory ?? "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: input.price ?? "0",
      priceCurrency: input.currency ?? "USD",
    },
  } as const;
  return input.aggregateRating
    ? {
        ...base,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: input.aggregateRating.ratingValue,
          ratingCount: input.aggregateRating.ratingCount,
        },
      }
    : base;
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function howToSchema(steps: { name: string; text: string }[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE.url}${item.url}`,
    })),
  };
}
