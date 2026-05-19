"use client";

import { CopyButton, Textarea, ToolShell } from "@/components/app/tool-shell";
import { cn } from "@/lib/utils";

interface DescriptionInput extends Record<string, unknown> {
  bulletsText: string;
  tone: "friendly" | "professional" | "playful";
}

interface DescriptionOutput {
  description: string;
}

const TONES: { value: DescriptionInput["tone"]; label: string; hint: string }[] = [
  { value: "friendly", label: "Friendly", hint: "Warm, conversational" },
  { value: "professional", label: "Professional", hint: "Crisp, direct" },
  { value: "playful", label: "Playful", hint: "Casual, witty" },
];

export function DescriptionGeneratorClient() {
  return (
    <ToolShell<DescriptionInput, DescriptionOutput>
      slug="description-generator"
      name="Description Generator"
      blurb="180–280 word Etsy listing with hook, scannable bullets, and soft CTA. 3 credits."
      creditCost={3}
      initialInput={{ bulletsText: "", tone: "friendly" }}
      transformBody={(input) => ({
        productBullets: input.bulletsText
          .split("\n")
          .map((line) => line.replace(/^[-•→\s]+/, "").trim())
          .filter(Boolean)
          .slice(0, 12),
        tone: input.tone,
      })}
      renderForm={({ input, setField, submitting }) => (
        <>
          <Textarea
            label="Product bullets (one per line)"
            value={input.bulletsText}
            onChange={(v) => setField("bulletsText", v)}
            placeholder={
              "hand-poured soy candle\n8oz amber glass jar\nlavender + vanilla scent\n40hr burn time\ncotton wick"
            }
            hint="What it is, materials, dimensions, scent/style, key features."
            disabled={submitting}
            rows={7}
            maxLength={2000}
          />
          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Tone</p>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => setField("tone", tone.value)}
                  aria-pressed={input.tone === tone.value}
                  disabled={submitting}
                  className={cn(
                    "rounded-md border p-2.5 text-left transition-colors",
                    input.tone === tone.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:bg-secondary",
                  )}
                >
                  <p className="text-foreground text-sm font-medium">{tone.label}</p>
                  <p className="text-muted-foreground text-xs">{tone.hint}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      renderOutput={(output) => (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              Description · {output.description.split(/\s+/).filter(Boolean).length} words
            </p>
            <CopyButton text={output.description} label="Copy" />
          </div>
          <div className="bg-secondary/40 border-border/60 mt-3 rounded border p-4">
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
              {output.description}
            </p>
          </div>
        </div>
      )}
    />
  );
}
