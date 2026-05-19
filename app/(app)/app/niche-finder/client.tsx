"use client";

import { Compass, TrendingUp } from "lucide-react";
import { TextInput, Textarea, ToolShell } from "@/components/app/tool-shell";
import { ScoreBar } from "@/components/app/score-display";

interface NicheInput extends Record<string, unknown> {
  seedCategory: string;
  targetAudience: string;
  pricePointHint: "" | "budget" | "mid" | "premium";
}

interface Cluster {
  name: string;
  positioning: string;
  demandScore: number;
  competitionScore: number;
  opportunityScore: number;
  sampleKeywords: string[];
  firstProductIdea: string;
}

interface NicheOutput {
  clusters: Cluster[];
  summary: string;
}

export function NicheFinderClient() {
  return (
    <ToolShell<NicheInput, NicheOutput>
      slug="niche-finder"
      name="Niche Finder"
      blurb="Surface 5 underserved sub-niches per seed category, scored demand vs competition. 4 credits. Claude Sonnet on Max."
      creditCost={4}
      initialInput={{ seedCategory: "", targetAudience: "", pricePointHint: "" }}
      transformBody={(input) => ({
        seedCategory: input.seedCategory,
        targetAudience: input.targetAudience || undefined,
        pricePointHint: input.pricePointHint || undefined,
      })}
      renderForm={({ input, setField, submitting }) => (
        <>
          <TextInput
            label="Seed category"
            value={input.seedCategory}
            onChange={(v) => setField("seedCategory", v)}
            placeholder="e.g. home decor, cottagecore stationery, wedding favors"
            disabled={submitting}
            maxLength={120}
            hint="Broad or narrow — the finder works at any zoom level."
          />
          <Textarea
            label="Target audience (optional)"
            value={input.targetAudience}
            onChange={(v) => setField("targetAudience", v)}
            placeholder="e.g. remote workers, new homeowners, gift shoppers"
            disabled={submitting}
            rows={2}
            maxLength={200}
          />
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">
              Price point (optional)
            </label>
            <div className="flex gap-2">
              {(["", "budget", "mid", "premium"] as const).map((p) => (
                <button
                  key={p || "any"}
                  type="button"
                  onClick={() => setField("pricePointHint", p)}
                  disabled={submitting}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors disabled:opacity-50 ${
                    input.pricePointHint === p
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {p || "any"}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      renderOutput={(output) => (
        <div className="space-y-5">
          <div className="border-primary/30 bg-primary/5 rounded-lg border p-4">
            <p className="text-primary inline-flex items-center gap-1.5 font-mono text-xs font-medium tracking-wider uppercase">
              <Compass className="size-3.5" aria-hidden /> Summary
            </p>
            <p className="text-foreground mt-2 text-sm leading-relaxed">{output.summary}</p>
          </div>

          <h3 className="text-muted-foreground font-mono text-xs font-medium tracking-wider uppercase">
            5 clusters · highest opportunity first
          </h3>

          <ol className="space-y-3">
            {output.clusters.map((cluster, i) => (
              <li
                key={cluster.name}
                className="border-border bg-card text-card-foreground rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                      Cluster {i + 1}
                    </p>
                    <h4 className="text-foreground mt-0.5 font-semibold">{cluster.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-primary inline-flex items-center gap-1 text-lg font-semibold tabular-nums">
                      <TrendingUp className="size-4" aria-hidden /> {cluster.opportunityScore}
                    </p>
                    <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                      Opportunity
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {cluster.positioning}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <ScoreBar score={cluster.demandScore} label="Demand" />
                  <ScoreBar score={100 - cluster.competitionScore} label="Headroom (vs comp)" />
                </div>

                <div className="mt-4">
                  <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                    Sample long-tail keywords
                  </p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {cluster.sampleKeywords.map((kw) => (
                      <li
                        key={kw}
                        className="bg-muted text-foreground rounded-md px-2 py-0.5 text-xs"
                      >
                        {kw}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-accent/30 bg-accent/5 mt-4 rounded-md border p-3">
                  <p className="text-accent-foreground font-mono text-[10px] tracking-wider uppercase">
                    First product idea
                  </p>
                  <p className="text-foreground mt-1 text-sm">{cluster.firstProductIdea}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    />
  );
}
