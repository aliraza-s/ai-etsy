"use client";

import { Smile, SmilePlus, Store } from "lucide-react";
import { CopyButton, Textarea, ToolShell } from "@/components/app/tool-shell";
import { cn } from "@/lib/utils";

interface DescriptionInput extends Record<string, unknown> {
  bulletsText: string;
  tone: "friendly" | "professional" | "playful";
  useEmoji: boolean;
  wordCount: "short" | "medium" | "long";
  aboutShop: string;
  includeShop: boolean;
}

interface DescriptionOutput {
  description: string;
}

const TONES: { value: DescriptionInput["tone"]; label: string; hint: string }[] = [
  { value: "friendly", label: "Friendly", hint: "Warm, conversational" },
  { value: "professional", label: "Professional", hint: "Crisp, direct" },
  { value: "playful", label: "Playful", hint: "Casual, witty" },
];

const WORD_COUNTS: { value: DescriptionInput["wordCount"]; label: string; hint: string }[] = [
  { value: "short", label: "Short", hint: "120-180 words" },
  { value: "medium", label: "Medium", hint: "200-300 words" },
  { value: "long", label: "Long", hint: "350-500 words" },
];

export function DescriptionGeneratorClient() {
  return (
    <ToolShell<DescriptionInput, DescriptionOutput>
      slug="description-generator"
      name="Description Generator"
      blurb="Etsy listing copy with hook, scannable bullets, and soft CTA. Optional emoji + shop story. 3 credits."
      creditCost={3}
      initialInput={{
        bulletsText: "",
        tone: "friendly",
        useEmoji: false,
        wordCount: "medium",
        aboutShop: "",
        includeShop: false,
      }}
      transformBody={(input) => ({
        productBullets: input.bulletsText
          .split("\n")
          .map((line) => line.replace(/^[-•→\s]+/, "").trim())
          .filter(Boolean)
          .slice(0, 12),
        tone: input.tone,
        useEmoji: input.useEmoji,
        wordCount: input.wordCount,
        aboutShop: input.aboutShop.trim() || undefined,
        includeShop: input.includeShop,
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

          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Length</p>
            <div className="grid grid-cols-3 gap-2">
              {WORD_COUNTS.map((wc) => (
                <button
                  key={wc.value}
                  type="button"
                  onClick={() => setField("wordCount", wc.value)}
                  aria-pressed={input.wordCount === wc.value}
                  disabled={submitting}
                  className={cn(
                    "rounded-md border p-2.5 text-left transition-colors",
                    input.wordCount === wc.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:bg-secondary",
                  )}
                >
                  <p className="text-foreground text-sm font-medium">{wc.label}</p>
                  <p className="text-muted-foreground text-xs">{wc.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            id="useEmoji"
            checked={input.useEmoji}
            onChange={(v) => setField("useEmoji", v)}
            disabled={submitting}
            icon={input.useEmoji ? <SmilePlus className="size-4" /> : <Smile className="size-4" />}
            title="Add emoji"
            hint="Sprinkles tasteful emoji into the hook and at the start of each bullet."
          />

          <ToggleRow
            id="includeShop"
            checked={input.includeShop}
            onChange={(v) => setField("includeShop", v)}
            disabled={submitting}
            icon={<Store className="size-4" />}
            title="Mention my shop"
            hint="Weaves 1-2 sentences from the box below into the closing paragraph."
          />

          {input.includeShop && (
            <Textarea
              label="About your shop"
              value={input.aboutShop}
              onChange={(v) => setField("aboutShop", v)}
              placeholder={
                "Small-batch candle studio in Portland, OR. Every order is hand-poured the day it ships. Free domestic shipping over $35."
              }
              hint="Story, location, USP, shipping policy — whatever makes your shop yours. AI rewrites it; you don't need it polished."
              disabled={submitting}
              rows={4}
              maxLength={800}
            />
          )}
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

function ToggleRow({
  id,
  checked,
  onChange,
  disabled,
  icon,
  title,
  hint,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "border-border bg-background hover:bg-secondary/60 flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
        checked && "border-primary/40 bg-primary/5",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex size-8 flex-none items-center justify-center rounded-md",
          checked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{hint}</p>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "relative mt-1 inline-flex h-5 w-9 flex-none items-center rounded-full border transition-colors",
          checked ? "border-primary bg-primary" : "border-border bg-muted",
        )}
      >
        <span
          className={cn(
            "bg-background block size-4 rounded-full shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </span>
    </label>
  );
}
