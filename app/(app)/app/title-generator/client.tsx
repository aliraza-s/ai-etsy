"use client";

import { useState } from "react";
import { CopyButton, Textarea, ToolShell } from "@/components/app/tool-shell";

interface TitleInput extends Record<string, unknown> {
  productDescription: string;
  attributesText: string;
}

interface TitleOutput {
  titles: string[];
}

export function TitleGeneratorClient() {
  return (
    <ToolShell<TitleInput, TitleOutput>
      slug="title-generator"
      name="Title Generator"
      blurb="Five Etsy listing titles, each <140 chars with the keyword front-loaded. 1 credit."
      creditCost={1}
      initialInput={{ productDescription: "", attributesText: "" }}
      transformBody={(input) => ({
        productDescription: input.productDescription,
        attributes: input.attributesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 8),
      })}
      renderForm={({ input, setField, submitting }) => (
        <>
          <Textarea
            label="Product description or current title"
            value={input.productDescription}
            onChange={(v) => setField("productDescription", v)}
            placeholder="Hand-knit wool throw blanket, 60x80, chunky knit, 100% merino, housewarming gift."
            disabled={submitting}
            rows={4}
            maxLength={2000}
          />
          <Textarea
            label="Attributes (optional, comma-separated)"
            value={input.attributesText}
            onChange={(v) => setField("attributesText", v)}
            placeholder="color: cream, material: wool, occasion: housewarming"
            hint="Helps the AI front-load specifics buyers search for."
            disabled={submitting}
            rows={2}
            maxLength={400}
          />
        </>
      )}
      renderOutput={(output) => <TitleResults titles={output.titles} />}
    />
  );
}

function TitleResults({ titles }: { titles: string[] }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">5 titles</p>
        <CopyButton text={titles.join("\n")} label="Copy all" />
      </div>
      <ul className="mt-3 space-y-2">
        {titles.map((title, i) => (
          <li
            key={i}
            className="bg-secondary/40 border-border/60 group flex items-start gap-2 rounded border p-3"
          >
            <button
              type="button"
              onClick={() => setPicked(i)}
              aria-pressed={picked === i}
              className={
                picked === i
                  ? "border-primary bg-primary text-primary-foreground flex size-5 flex-none items-center justify-center rounded-full border text-[10px] font-semibold"
                  : "border-border bg-background text-muted-foreground flex size-5 flex-none items-center justify-center rounded-full border text-[10px] font-medium"
              }
              title="Mark as your pick"
            >
              {i + 1}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm leading-relaxed">{title}</p>
              <p className="text-muted-foreground mt-1 font-mono text-xs">
                {title.length}/140 chars
              </p>
            </div>
            <CopyButton text={title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
