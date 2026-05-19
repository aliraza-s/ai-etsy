"use client";

import { CopyButton, Textarea, TextInput, ToolShell } from "@/components/app/tool-shell";

interface TagInput extends Record<string, unknown> {
  productTitle: string;
  productDetails: string;
}

interface TagOutput {
  tags: string[];
}

export function TagGeneratorClient() {
  return (
    <ToolShell<TagInput, TagOutput>
      slug="tag-generator"
      name="Tag Generator"
      blurb="Fill all 13 Etsy tag slots with high-search, multi-word phrases. 1 credit per run."
      creditCost={1}
      initialInput={{ productTitle: "", productDetails: "" }}
      renderForm={({ input, setField, submitting }) => (
        <>
          <TextInput
            label="Product title"
            value={input.productTitle}
            onChange={(v) => setField("productTitle", v)}
            placeholder="e.g., hand-poured soy candle, vanilla scent, 8oz tin"
            hint="The shorter the better — focus on what the buyer is searching for."
            disabled={submitting}
            maxLength={140}
          />
          <Textarea
            label="Extra details (optional)"
            value={input.productDetails}
            onChange={(v) => setField("productDetails", v)}
            placeholder="Material, dimensions, occasion, style — anything that helps tags get specific."
            hint="Skip if the title already covers it."
            disabled={submitting}
            rows={3}
            maxLength={2000}
          />
        </>
      )}
      renderOutput={(output) => (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
              13 tags
            </p>
            <CopyButton text={output.tags.join(", ")} label="Copy all" />
          </div>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {output.tags.map((tag, i) => (
              <li
                key={`${tag}-${i}`}
                className="bg-secondary/40 border-border/60 group flex items-center justify-between rounded border px-3 py-2"
              >
                <span className="text-foreground font-mono text-sm">{tag}</span>
                <CopyButton text={tag} />
              </li>
            ))}
          </ul>
        </div>
      )}
    />
  );
}
