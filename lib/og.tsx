import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo/site";

/**
 * Shared OG image template (1200×630).
 *
 * Used by every `opengraph-image.tsx` file in `app/`. Renders an inline
 * gradient + glyph + headline + subline + brand mark — no network image
 * fetches and no `z-index` (Satori — the renderer behind `next/og` — doesn't
 * support `z-index`; we use source order for stacking instead).
 *
 * Glyphs are plain ASCII characters (no emoji), so we don't trigger an emoji
 * font fetch from jsdelivr at build time. Drop "✨"-style glyphs and Satori
 * tries to resolve an emoji font over the network, which fails on offline
 * builds.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

interface OgInput {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** ASCII-safe glyph for the top-left badge (e.g. "C", "$", "+", "/"). */
  glyph?: string;
  accent?: "teal" | "amber";
}

const TEAL = "#0D9488";
const AMBER = "#F59E0B";
const ZINC_50 = "#FAFAFA";
const ZINC_900 = "#18181B";
const ZINC_700 = "#3F3F46";
const ZINC_400 = "#A1A1AA";

export function ogImage(input: OgInput): ImageResponse {
  const accentColor = input.accent === "amber" ? AMBER : TEAL;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${ZINC_50} 0%, #F4F4F5 60%, ${accentColor}14 100%)`,
        padding: "64px",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        color: ZINC_900,
        position: "relative",
      }}
    >
      {/* Background — dot pattern (no z-index; rendered first so it sits behind everything) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(${accentColor}22 1px, transparent 1px) 0 0 / 32px 32px`,
          opacity: 0.4,
        }}
      />
      {/* Accent rail */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 12,
          background: accentColor,
        }}
      />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {input.glyph && (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: accentColor,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            {input.glyph}
          </div>
        )}
        {input.eyebrow && (
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            {input.eyebrow}
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: "flex" }} />

      {/* Headline + subline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <h1
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
            color: ZINC_900,
          }}
        >
          {input.title}
        </h1>
        {input.subtitle && (
          <p
            style={{
              fontSize: 32,
              lineHeight: 1.35,
              margin: 0,
              color: ZINC_700,
              maxWidth: 980,
            }}
          >
            {input.subtitle}
          </p>
        )}
      </div>

      {/* Footer mark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 36,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: TEAL,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          C
        </div>
        <span style={{ fontSize: 26, fontWeight: 700, color: ZINC_900 }}>{SITE.name}</span>
        <span style={{ fontSize: 22, color: ZINC_400, marginLeft: 4 }}>· {SITE.tagline}</span>
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
