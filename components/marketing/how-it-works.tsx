import type { ReactNode } from "react";
import { StepPaste, StepGenerate, StepRank } from "@/components/illustrations/step-illustrations";

export interface Step {
  title: string;
  body: string;
  illustration?: ReactNode;
}

const DEFAULT_STEPS: Step[] = [
  {
    title: "1. Paste your listing",
    body: "Drop in a title, description, or shop URL — no Etsy API or scraping.",
    illustration: <StepPaste />,
  },
  {
    title: "2. AI does the heavy lifting",
    body: "Claude and Qwen analyze, optimize, and rewrite for Etsy search and buyers.",
    illustration: <StepGenerate />,
  },
  {
    title: "3. Copy, paste, and rank",
    body: "Get tags, titles, and rewrites ready for your listing. Track lifts in your dashboard.",
    illustration: <StepRank />,
  },
];

export function HowItWorks({ steps = DEFAULT_STEPS }: { steps?: Step[] }) {
  return (
    <ol className="grid gap-10 sm:gap-8 lg:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex flex-col items-center text-center">
          <div className="text-primary/30 font-display absolute -top-2 right-4 text-7xl leading-none font-bold sm:right-8">
            {String(i + 1).padStart(2, "0")}
          </div>
          {step.illustration && (
            <div className="relative z-10 mb-5 flex h-44 w-full items-center justify-center">
              {step.illustration}
            </div>
          )}
          <h3 className="text-foreground relative z-10 text-lg font-semibold">{step.title}</h3>
          <p className="text-muted-foreground relative z-10 mt-2 max-w-xs text-sm leading-relaxed">
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
