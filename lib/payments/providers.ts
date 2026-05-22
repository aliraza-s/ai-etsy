import { z } from "zod";

/**
 * Per-payment-provider config shape + display metadata.
 *
 * Each provider has its own set of credentials (Stripe wants a publishable
 * key + secret key + webhook secret; Paddle wants a vendor ID + API key + etc.)
 * so we model each one explicitly with zod and keep a small `fields` array for
 * the admin form to render. The actual secrets are stored AES-256-GCM-encrypted
 * as a JSON blob — see `PaymentProviderConfig` in schema.prisma.
 */

export const PAYMENT_PROVIDERS = ["PADDLE", "STRIPE", "PAYPAL", "LEMON_SQUEEZY"] as const;
export type PaymentProviderId = (typeof PAYMENT_PROVIDERS)[number];

export interface ProviderField {
  key: string;
  label: string;
  placeholder?: string;
  /** Mark as secret so the form renders a masked input + last-4 display. */
  secret: boolean;
  /** Optional doc link to help admins find their value. */
  helpUrl?: string;
  /** Whether the field is optional (still validated when provided). */
  optional?: boolean;
}

export interface ProviderMeta {
  id: PaymentProviderId;
  label: string;
  blurb: string;
  /** Dashboard link admins can open to find their credentials. */
  consoleUrl: string;
  /** Webhook URL to register with the provider (filled in at runtime). */
  webhookPath: string;
  fields: ProviderField[];
  /** zod schema validating the JSON config stored encrypted. */
  schema: z.ZodTypeAny;
  /** Which field's value becomes the `lastFour` display. */
  primarySecretKey: string;
}

export const PADDLE_META: ProviderMeta = {
  id: "PADDLE",
  label: "Paddle",
  blurb:
    "Merchant-of-record billing. Best for SaaS that wants tax/VAT handled. Configure both your Vendor ID and the API key.",
  consoleUrl: "https://vendors.paddle.com/authentication-v2",
  webhookPath: "/api/webhooks/paddle",
  primarySecretKey: "apiKey",
  fields: [
    { key: "vendorId", label: "Vendor ID", secret: false, placeholder: "e.g. 12345" },
    { key: "apiKey", label: "API key", secret: true, placeholder: "pdl_live_…" },
    {
      key: "publicKey",
      label: "Public key (PEM)",
      secret: true,
      placeholder: "-----BEGIN PUBLIC KEY-----…",
    },
    { key: "webhookSecret", label: "Webhook secret", secret: true, placeholder: "whsec_…" },
  ],
  schema: z.object({
    vendorId: z.string().trim().min(1).max(64),
    apiKey: z.string().trim().min(10).max(512),
    publicKey: z.string().trim().min(20).max(4096),
    webhookSecret: z.string().trim().min(8).max(512),
  }),
};

export const STRIPE_META: ProviderMeta = {
  id: "STRIPE",
  label: "Stripe",
  blurb:
    "Card payments + subscriptions. You handle tax. Use restricted keys when possible — the secret key is encrypted at rest.",
  consoleUrl: "https://dashboard.stripe.com/apikeys",
  webhookPath: "/api/webhooks/stripe",
  primarySecretKey: "secretKey",
  fields: [
    {
      key: "publishableKey",
      label: "Publishable key",
      secret: false,
      placeholder: "pk_live_… or pk_test_…",
    },
    {
      key: "secretKey",
      label: "Secret key",
      secret: true,
      placeholder: "sk_live_… or sk_test_…",
    },
    { key: "webhookSecret", label: "Webhook signing secret", secret: true, placeholder: "whsec_…" },
  ],
  schema: z.object({
    publishableKey: z.string().trim().min(10).max(256).regex(/^pk_(live|test)_/, "Must start with pk_live_ or pk_test_"),
    secretKey: z
      .string()
      .trim()
      .min(10)
      .max(256)
      .regex(/^(sk|rk)_(live|test)_/, "Must start with sk_/rk_ live_/test_"),
    webhookSecret: z.string().trim().min(8).max(256).regex(/^whsec_/, "Must start with whsec_"),
  }),
};

export const PAYPAL_META: ProviderMeta = {
  id: "PAYPAL",
  label: "PayPal",
  blurb: "Add PayPal Checkout for customers who prefer it. Subscription support is limited.",
  consoleUrl: "https://developer.paypal.com/dashboard/applications",
  webhookPath: "/api/webhooks/paypal",
  primarySecretKey: "clientSecret",
  fields: [
    { key: "clientId", label: "Client ID", secret: false, placeholder: "A21AA…" },
    { key: "clientSecret", label: "Client secret", secret: true, placeholder: "EA…" },
    {
      key: "webhookId",
      label: "Webhook ID",
      secret: false,
      optional: true,
      placeholder: "1JE…",
    },
  ],
  schema: z.object({
    clientId: z.string().trim().min(10).max(256),
    clientSecret: z.string().trim().min(10).max(256),
    webhookId: z.string().trim().max(128).optional().or(z.literal("")).transform((v) => v || undefined),
  }),
};

export const LEMON_SQUEEZY_META: ProviderMeta = {
  id: "LEMON_SQUEEZY",
  label: "Lemon Squeezy",
  blurb:
    "Merchant-of-record alternative to Paddle. Pull your API key + signing secret from the Lemon Squeezy dashboard.",
  consoleUrl: "https://app.lemonsqueezy.com/settings/api",
  webhookPath: "/api/webhooks/lemon-squeezy",
  primarySecretKey: "apiKey",
  fields: [
    { key: "storeId", label: "Store ID", secret: false, placeholder: "e.g. 12345" },
    { key: "apiKey", label: "API key", secret: true, placeholder: "eyJ0eXAiOi…" },
    { key: "webhookSecret", label: "Webhook signing secret", secret: true, placeholder: "whsec_…" },
  ],
  schema: z.object({
    storeId: z.string().trim().min(1).max(64),
    apiKey: z.string().trim().min(20).max(2048),
    webhookSecret: z.string().trim().min(8).max(256),
  }),
};

export const PROVIDER_META: Record<PaymentProviderId, ProviderMeta> = {
  PADDLE: PADDLE_META,
  STRIPE: STRIPE_META,
  PAYPAL: PAYPAL_META,
  LEMON_SQUEEZY: LEMON_SQUEEZY_META,
};

export function parseProviderSlug(slug: string): PaymentProviderId | null {
  const upper = slug.toUpperCase().replace(/-/g, "_");
  return (PAYMENT_PROVIDERS as readonly string[]).includes(upper)
    ? (upper as PaymentProviderId)
    : null;
}

export function providerSlug(id: PaymentProviderId): string {
  return id.toLowerCase().replace(/_/g, "-");
}

/** Pull a primary-secret last-4 from a parsed config blob (display only). */
export function extractLastFour(meta: ProviderMeta, parsed: Record<string, unknown>): string {
  const raw = parsed[meta.primarySecretKey];
  if (typeof raw !== "string" || raw.length === 0) return "";
  return raw.slice(-4);
}
