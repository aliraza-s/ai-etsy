"use client";

import { Textarea, TextInput, ToolShell } from "@/components/app/tool-shell";
import { ScoreRing, ScoreBar, WinsAndFixes } from "@/components/app/score-display";

interface ShopInput extends Record<string, unknown> {
  shopName: string;
  niche: string;
  about: string;
  announcement: string;
  listingCountText: string;
  reviewCountText: string;
  topListingsText: string;
}

interface PillarScore {
  score: number;
  why: string;
}

interface ShopOutput {
  overallScore: number;
  pillars: {
    branding: PillarScore;
    seo: PillarScore;
    conversion: PillarScore;
    policy: PillarScore;
    diversity: PillarScore;
  };
  topWins: string[];
  topFixes: string[];
  brandVoiceNotes: string;
}

const PILLAR_LABELS: Record<keyof ShopOutput["pillars"], string> = {
  branding: "Branding",
  seo: "SEO",
  conversion: "Conversion",
  policy: "Policy",
  diversity: "Diversity",
};

export function ShopAnalyzerClient() {
  return (
    <ToolShell<ShopInput, ShopOutput>
      slug="shop-analyzer"
      name="Shop Analyzer"
      blurb="Whole-shop audit across branding, SEO, conversion, policy, and diversity. 8 credits. Claude Sonnet on Max."
      creditCost={8}
      initialInput={{
        shopName: "",
        niche: "",
        about: "",
        announcement: "",
        listingCountText: "",
        reviewCountText: "",
        topListingsText: "",
      }}
      transformBody={(input) => ({
        shopName: input.shopName,
        about: input.about,
        announcement: input.announcement || undefined,
        niche: input.niche || undefined,
        listingCount: Math.max(0, Number.parseInt(input.listingCountText, 10) || 0),
        reviewCount: input.reviewCountText
          ? Math.max(0, Number.parseInt(input.reviewCountText, 10) || 0)
          : undefined,
        topListingsText: input.topListingsText || undefined,
      })}
      renderForm={({ input, setField, submitting }) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Shop name"
              value={input.shopName}
              onChange={(v) => setField("shopName", v)}
              placeholder="CozyCrafts"
              disabled={submitting}
              maxLength={80}
            />
            <TextInput
              label="Niche (optional)"
              value={input.niche}
              onChange={(v) => setField("niche", v)}
              placeholder="hand-poured candles"
              disabled={submitting}
              maxLength={120}
            />
          </div>
          <Textarea
            label="About section"
            value={input.about}
            onChange={(v) => setField("about", v)}
            placeholder="Paste your About text exactly as it appears."
            disabled={submitting}
            rows={5}
            maxLength={3000}
          />
          <Textarea
            label="Shop announcement (optional)"
            value={input.announcement}
            onChange={(v) => setField("announcement", v)}
            placeholder="Your current shop announcement, if any."
            disabled={submitting}
            rows={3}
            maxLength={1000}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Listings"
              value={input.listingCountText}
              onChange={(v) => setField("listingCountText", v.replace(/\D/g, ""))}
              placeholder="23"
              disabled={submitting}
            />
            <TextInput
              label="Reviews (optional)"
              value={input.reviewCountText}
              onChange={(v) => setField("reviewCountText", v.replace(/\D/g, ""))}
              placeholder="42"
              disabled={submitting}
            />
          </div>
          <Textarea
            label="Top listings — paste a few titles (optional)"
            value={input.topListingsText}
            onChange={(v) => setField("topListingsText", v)}
            placeholder="One title per line — helps the audit see your keyword pattern across listings."
            disabled={submitting}
            rows={4}
            maxLength={3000}
          />
        </>
      )}
      renderOutput={(output) => (
        <div className="space-y-6">
          <div className="flex items-start gap-5">
            <ScoreRing score={output.overallScore} />
            <div>
              <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                Overall shop score
              </p>
              <h3 className="text-foreground mt-1 text-xl font-semibold">
                {shopVerdict(output.overallScore)}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Five pillars below explain the score.
              </p>
            </div>
          </div>

          <WinsAndFixes wins={output.topWins} fixes={output.topFixes} />

          <div>
            <h4 className="text-muted-foreground mb-3 font-mono text-xs font-medium tracking-wider uppercase">
              Pillar breakdown
            </h4>
            <div className="space-y-3">
              {(Object.keys(PILLAR_LABELS) as (keyof typeof PILLAR_LABELS)[]).map((pillar) => {
                const data = output.pillars[pillar];
                return (
                  <div
                    key={pillar}
                    className="border-border bg-card text-card-foreground rounded-lg border p-4"
                  >
                    <ScoreBar score={data.score} label={PILLAR_LABELS[pillar]} />
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{data.why}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-primary/30 bg-primary/5 rounded-lg border p-4">
            <p className="text-primary font-mono text-xs font-medium tracking-wider uppercase">
              Brand voice
            </p>
            <p className="text-foreground mt-2 text-sm leading-relaxed">{output.brandVoiceNotes}</p>
          </div>
        </div>
      )}
    />
  );
}

function shopVerdict(score: number): string {
  if (score >= 85) return "Strong shop — protect the brand.";
  if (score >= 70) return "Solid shop with a few high-leverage fixes.";
  if (score >= 50) return "Mixed — fundamentals need work before scaling.";
  if (score >= 30) return "Weak signals are costing you trust.";
  return "Critical — start with About + policies before anything else.";
}
