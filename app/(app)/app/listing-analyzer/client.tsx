"use client";

import { Textarea, TextInput, ToolShell } from "@/components/app/tool-shell";
import { ScoreRing, ScoredAxisCard, WinsAndFixes } from "@/components/app/score-display";

interface ListingInput extends Record<string, unknown> {
  title: string;
  tagsText: string;
  description: string;
  attributesText: string;
  priceText: string;
  photoCountText: string;
  category: string;
}

interface AxisScore {
  score: number;
  why: string;
  fixes: string[];
}

interface ListingOutput {
  score: number;
  axes: {
    titleSeo: AxisScore;
    tagRelevance: AxisScore;
    descriptionQuality: AxisScore;
    photoCoverage: AxisScore;
    attributes: AxisScore;
  };
  topWins: string[];
  topFixes: string[];
  quickWin: string;
}

const AXIS_LABELS: Record<keyof ListingOutput["axes"], string> = {
  titleSeo: "Title SEO",
  tagRelevance: "Tag relevance",
  descriptionQuality: "Description quality",
  photoCoverage: "Photo coverage",
  attributes: "Attributes",
};

export function ListingAnalyzerClient() {
  return (
    <ToolShell<ListingInput, ListingOutput>
      slug="listing-analyzer"
      name="Listing Analyzer"
      blurb="Deep AI audit of one Etsy listing. 5-axis score, prioritized fixes, quick win. 5 credits."
      creditCost={5}
      initialInput={{
        title: "",
        tagsText: "",
        description: "",
        attributesText: "",
        priceText: "",
        photoCountText: "",
        category: "",
      }}
      transformBody={(input) => ({
        title: input.title,
        tags: input.tagsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 13),
        description: input.description,
        attributes: input.attributesText
          ? input.attributesText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 20)
          : undefined,
        priceUsd: input.priceText ? Number.parseFloat(input.priceText) : undefined,
        photoCount: input.photoCountText
          ? Math.max(0, Math.min(10, Number.parseInt(input.photoCountText, 10) || 0))
          : undefined,
        category: input.category || undefined,
      })}
      renderForm={({ input, setField, submitting }) => (
        <>
          <TextInput
            label="Listing title"
            value={input.title}
            onChange={(v) => setField("title", v)}
            placeholder="The exact title from your listing"
            disabled={submitting}
            maxLength={200}
          />
          <Textarea
            label="Tags (comma-separated)"
            value={input.tagsText}
            onChange={(v) => setField("tagsText", v)}
            placeholder="soy candle, vanilla scented, housewarming gift, hand poured, …"
            hint="Paste up to 13 tags as you have them on Etsy."
            disabled={submitting}
            rows={2}
            maxLength={400}
          />
          <Textarea
            label="Description"
            value={input.description}
            onChange={(v) => setField("description", v)}
            placeholder="Paste your full listing description here."
            disabled={submitting}
            rows={5}
            maxLength={5000}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Price USD"
              value={input.priceText}
              onChange={(v) => setField("priceText", v.replace(/[^0-9.]/g, ""))}
              placeholder="25.00"
              disabled={submitting}
            />
            <TextInput
              label="Photos used"
              value={input.photoCountText}
              onChange={(v) => setField("photoCountText", v.replace(/\D/g, "").slice(0, 2))}
              placeholder="0–10"
              hint="Etsy allows up to 10."
              disabled={submitting}
            />
          </div>
          <TextInput
            label="Category (optional)"
            value={input.category}
            onChange={(v) => setField("category", v)}
            placeholder="e.g., Home & Living › Candles & Holders"
            disabled={submitting}
            maxLength={120}
          />
          <Textarea
            label="Attributes (optional, comma-separated)"
            value={input.attributesText}
            onChange={(v) => setField("attributesText", v)}
            placeholder="occasion: housewarming, color: amber, material: soy wax"
            disabled={submitting}
            rows={2}
            maxLength={500}
          />
        </>
      )}
      renderOutput={(output) => (
        <div className="space-y-6">
          {/* Overall score + headline */}
          <div className="flex items-start gap-5">
            <ScoreRing score={output.score} />
            <div>
              <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                Listing visibility score
              </p>
              <h3 className="text-foreground mt-1 text-xl font-semibold">
                {scoreVerdict(output.score)}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Driven by the axis breakdown below.
              </p>
            </div>
          </div>

          {/* Wins + Fixes */}
          <WinsAndFixes wins={output.topWins} fixes={output.topFixes} quickWin={output.quickWin} />

          {/* Per-axis breakdown */}
          <div>
            <h4 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
              Per-axis breakdown
            </h4>
            <div className="space-y-3">
              {(Object.keys(AXIS_LABELS) as (keyof typeof AXIS_LABELS)[]).map((axis) => {
                const data = output.axes[axis];
                return (
                  <ScoredAxisCard
                    key={axis}
                    label={AXIS_LABELS[axis]}
                    score={data.score}
                    why={data.why}
                    fixes={data.fixes}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    />
  );
}

function scoreVerdict(score: number): string {
  if (score >= 85) return "Strong listing — minor polishing only.";
  if (score >= 70) return "Solid listing with clear room to grow.";
  if (score >= 50) return "Mixed — some fundamentals to fix.";
  if (score >= 30) return "Weak fundamentals are costing you sales.";
  return "Critical — rebuild from the title down.";
}
