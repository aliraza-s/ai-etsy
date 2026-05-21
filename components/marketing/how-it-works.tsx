import type { ReactNode } from "react";
import { ClipboardPaste, Sparkles, ArrowDown, Rocket, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  title: string;
  body: string;
  /** Optional illustration. When omitted, only the step icon shows. */
  illustration?: ReactNode;
  /** Optional icon override. When omitted, defaults rotate per step index. */
  icon?: ReactNode;
}

const DEFAULT_ICONS = [
  <ClipboardPaste className="size-5" aria-hidden key="paste" />,
  <Sparkles className="size-5" aria-hidden key="ai" />,
  <Rocket className="size-5" aria-hidden key="ship" />,
];

const DEFAULT_STEPS: Step[] = [
  {
    title: "Paste your listing",
    body: "Drop in a title, description, or shop URL — no Etsy API or scraping.",
  },
  {
    title: "AI does the heavy lifting",
    body: "Claude and Qwen analyze, optimize, and rewrite for Etsy search and buyers.",
  },
  {
    title: "Copy, paste, and rank",
    body: "Get tags, titles, and rewrites ready to ship. Track lifts in your dashboard.",
  },
];

/**
 * Connected three-step timeline.
 *
 * Desktop (lg+): cards laid out horizontally with a small chevron connector
 * between them. Mobile: cards stack vertically with a down-arrow connector.
 *
 * Each card shows a numbered chip + step icon + optional illustration + title
 * + body. Step titles should NOT include a leading "1.", "2." — the numbered
 * chip provides that visual anchor and the renderer strips legacy prefixes.
 */
export function HowItWorks({ steps = DEFAULT_STEPS }: { steps?: Step[] }) {
  return (
    <ol className="relative grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-3">
      {steps.map((step, i) => {
        const cleanTitle = stripLeadingNumber(step.title);
        return (
          <li key={cleanTitle} className="contents">
            <article
              className={cn(
                "border-border bg-card text-card-foreground card-hover group relative flex flex-col overflow-hidden rounded-2xl border p-6 sm:p-7",
              )}
            >
              <div
                aria-hidden
                className="from-primary/0 to-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              {/* Numbered chip + icon row */}
              <div className="relative flex items-center justify-between">
                <span
                  aria-hidden
                  className="text-primary border-primary/30 bg-primary/5 inline-flex h-6 items-center rounded-md border px-2 font-mono text-[11px] font-semibold tracking-wider tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="bg-primary/10 text-primary ring-primary/20 inline-flex size-10 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105">
                  {step.icon ?? DEFAULT_ICONS[i % DEFAULT_ICONS.length]}
                </span>
              </div>

              {/* Optional illustration */}
              {step.illustration && (
                <div className="mt-4 flex h-28 w-full items-center justify-center">
                  {step.illustration}
                </div>
              )}

              {/* Title + body */}
              <h3 className="text-foreground mt-4 text-base leading-snug font-semibold sm:text-lg">
                {cleanTitle}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{step.body}</p>
            </article>

            {/* Connector between cards — chevron on desktop, down-arrow on mobile.
                Rendered after every card except the last. */}
            {i < steps.length - 1 && (
              <div
                aria-hidden
                className="text-muted-foreground/50 flex items-center justify-center py-2 lg:py-0"
              >
                <ChevronRight className="hidden size-5 lg:block" />
                <ArrowDown className="size-5 lg:hidden" />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Tolerates legacy titles like "1. Paste …" by stripping the prefix. */
function stripLeadingNumber(title: string): string {
  return title.replace(/^\s*\d+\.\s*/, "");
}
