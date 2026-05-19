import Script from "next/script";

/**
 * Plausible Analytics — privacy-friendly, no cookies, no PII.
 *
 * Only renders when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set. Works with both
 * Plausible Cloud (default `script.js`) and a self-hosted instance — point
 * `NEXT_PUBLIC_PLAUSIBLE_SRC` at the hosted script URL.
 *
 * No-ops in development unless you opt in by setting the env vars, so local
 * development never accidentally pings a production analytics endpoint.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.js";

  return <Script defer strategy="afterInteractive" src={src} data-domain={domain} />;
}
