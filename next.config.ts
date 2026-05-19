import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * We use `headers()` rather than the proxy/middleware so they apply
 * unconditionally — including to static assets, OG images, and the manifest —
 * and survive every edge case where middleware doesn't run.
 *
 * CSP notes:
 *  - `'unsafe-inline'` on `style-src` is required for Tailwind's inline styles
 *    and our SVG illustrations. Removing it requires moving every inline style
 *    to global CSS.
 *  - `'unsafe-eval'` on `script-src` is required by Next.js dev/Turbopack and
 *    Lottie's runtime — both rely on dynamic code. We can drop it once Lottie
 *    is replaced or once Next.js' production bundles run without eval (already
 *    true today). We allow eval only via the dev-vs-prod split below.
 *  - Plausible domain is whitelisted when configured via NEXT_PUBLIC_PLAUSIBLE_DOMAIN.
 */
const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC;
const PLAUSIBLE_ORIGIN = PLAUSIBLE_SRC ? new URL(PLAUSIBLE_SRC).origin : "https://plausible.io";

const isDev = process.env.NODE_ENV !== "production";

const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  // Scripts: self + Plausible (when enabled). Dev needs eval for HMR; prod doesn't.
  "script-src": isDev
    ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", PLAUSIBLE_ORIGIN]
    : ["'self'", "'unsafe-inline'", PLAUSIBLE_ORIGIN],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  "connect-src": [
    "'self'",
    PLAUSIBLE_ORIGIN,
    // Auth.js + AI provider XHRs originate from the server in our setup,
    // not the browser. Same-origin is sufficient for the client side.
  ],
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
  "frame-src": ["'self'"],
  "manifest-src": ["'self'"],
  "worker-src": ["'self'", "blob:"],
  "upgrade-insecure-requests": [],
};

const csp = Object.entries(cspDirectives)
  .map(([k, v]) => (v.length ? `${k} ${v.join(" ")}` : k))
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // React strict mode for catching legacy patterns early.
  reactStrictMode: true,
  // Don't broadcast the Next.js version in response headers.
  poweredByHeader: false,
  // Force trailing-slash off so canonical URLs stay clean.
  trailingSlash: false,

  async headers() {
    return [
      // Apply security headers to every route.
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Admin pages: also forbid indexing by search engines.
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" }],
      },
      // App pages (signed-in tools): also forbid indexing.
      {
        source: "/app/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      // Auth pages: forbid indexing.
      { source: "/signin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/verify-email", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/auth/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // Brand assets — cache for a long time, they only change with the brand.
      {
        source: "/icon",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800" }],
      },
      {
        source: "/apple-icon",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800" }],
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800" }],
      },
      // Sitemap + robots: medium cache.
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" }],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" }],
      },
      {
        source: "/blog/feed.xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" }],
      },
    ];
  },
};

export default nextConfig;
