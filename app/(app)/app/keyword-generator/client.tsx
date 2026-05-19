"use client";

import { useState } from "react";
import { CopyButton, TextInput, ToolShell } from "@/components/app/tool-shell";
import { cn } from "@/lib/utils";

interface KeywordInput extends Record<string, unknown> {
  seed: string;
  niche: string;
}

interface KeywordOutput {
  keywords: { phrase: string; intent: "high" | "medium" | "low" }[];
}

const INTENT_STYLES: Record<"high" | "medium" | "low", string> = {
  high: "bg-primary/15 text-primary",
  medium: "bg-accent/15 text-accent-foreground",
  low: "bg-secondary text-muted-foreground",
};

export function KeywordGeneratorClient() {
  return (
    <ToolShell<KeywordInput, KeywordOutput>
      slug="keyword-generator"
      name="Keyword Generator"
      blurb="30 long-tail Etsy keywords, scored by buyer intent. 2 credits per run."
      creditCost={2}
      initialInput={{ seed: "", niche: "" }}
      renderForm={({ input, setField, submitting }) => (
        <>
          <TextInput
            label="Seed keyword"
            value={input.seed}
            onChange={(v) => setField("seed", v)}
            placeholder="e.g., soy candle, boho jewelry, wall planner"
            hint="One product type or niche term."
            disabled={submitting}
            maxLength={80}
          />
          <TextInput
            label="Niche (optional)"
            value={input.niche}
            onChange={(v) => setField("niche", v)}
            placeholder="e.g., for weddings, gifts for him, minimalist"
            hint="Narrows the AI's intent scoring."
            disabled={submitting}
            maxLength={80}
          />
        </>
      )}
      renderOutput={(output) => <KeywordResults output={output} />}
    />
  );
}

function KeywordResults({ output }: { output: KeywordOutput }) {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const filtered = output.keywords.filter((k) => filter === "all" || k.intent === filter);

  const allText = output.keywords.map((k) => k.phrase).join("\n");
  const highText = output.keywords
    .filter((k) => k.intent === "high")
    .map((k) => k.phrase)
    .join("\n");

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
          {output.keywords.length} keywords
        </p>
        <div className="flex items-center gap-1.5">
          <CopyButton text={highText} label="Copy high-intent" />
          <CopyButton text={allText} label="Copy all" />
        </div>
      </div>

      <div className="border-border/60 mt-3 flex gap-1 border-b pb-2">
        {(["all", "high", "medium", "low"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setFilter(opt)}
            aria-pressed={filter === opt}
            className={cn(
              "rounded px-2 py-0.5 font-mono text-[11px] tracking-wider uppercase transition-colors",
              filter === opt
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt}
          </button>
        ))}
        <span className="text-muted-foreground ml-auto font-mono text-xs">
          {filtered.length} shown
        </span>
      </div>

      <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {filtered.map((kw, i) => (
          <li
            key={`${kw.phrase}-${i}`}
            className="bg-secondary/40 border-border/60 group flex items-center justify-between rounded border px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <span className="text-foreground font-mono text-sm">{kw.phrase}</span>
            </div>
            <span
              className={cn(
                "ml-2 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase",
                INTENT_STYLES[kw.intent],
              )}
            >
              {kw.intent}
            </span>
            <CopyButton text={kw.phrase} />
          </li>
        ))}
      </ul>
    </div>
  );
}
