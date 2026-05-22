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
  /**
   * Visual accent — names retained ("teal" / "amber") for backwards-compat with
   * existing callers but colors now resolve to the new terracotta / sage palette.
   */
  accent?: "teal" | "amber";
}

const TERRACOTTA = "#D7765A"; // primary brand
const SAGE = "#5DA8A0"; // accent (was the "teal" slot)
const CREAM_50 = "#FBF9F6";
const CREAM_100 = "#F2EFEA";
const INK_900 = "#1A1612";
const INK_700 = "#403933";
const INK_400 = "#A39A91";

export function ogImage(input: OgInput): ImageResponse {
  const accentColor = input.accent === "amber" ? TERRACOTTA : SAGE;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${CREAM_50} 0%, ${CREAM_100} 60%, ${accentColor}14 100%)`,
        padding: "64px",
        fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        color: INK_900,
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
            color: INK_900,
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
              color: INK_700,
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
            background: TERRACOTTA,
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
        <span style={{ fontSize: 22, color: INK_400, marginLeft: 4 }}>· {SITE.tagline}</span>
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
