"use client";

import { Lightbulb, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScoreRing({
  score,
  size = "lg",
  label,
}: {
  score: number;
  size?: "lg" | "md";
  label?: string;
}) {
  const radius = size === "lg" ? 52 : 32;
  const stroke = size === "lg" ? 8 : 6;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const dim = (radius + stroke) * 2;
  const tone = scoreTone(score);

  return (
    <div
      className="relative inline-flex flex-col items-center justify-center"
      style={{ width: dim, height: dim }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={tone.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-label={`Score ${score} out of 100`}
      >
        <span
          className={cn(
            size === "lg" ? "text-3xl" : "text-xl",
            "font-semibold tabular-nums",
            tone.text,
          )}
        >
          {score}
        </span>
        {size === "lg" && (
          <span className="text-muted-foreground -mt-0.5 font-mono text-[10px] tracking-wider uppercase">
            / 100
          </span>
        )}
      </div>
      {label && size === "md" && (
        <span className="text-muted-foreground mt-1 text-xs">{label}</span>
      )}
    </div>
  );
}

export function ScoreBar({ score, label }: { score: number; label: string }) {
  const tone = scoreTone(score);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-foreground text-sm font-medium">{label}</span>
        <span className={cn("text-sm font-semibold tabular-nums", tone.text)}>{score}</span>
      </div>
      <div className="bg-muted mt-1.5 h-2 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${score}%`, backgroundColor: tone.bar }}
          aria-hidden
        />
      </div>
    </div>
  );
}

export function ScoredAxisCard({
  label,
  score,
  why,
  fixes,
}: {
  label: string;
  score: number;
  why: string;
  fixes?: string[];
}) {
  return (
    <div className="border-border bg-card text-card-foreground rounded-lg border p-4">
      <ScoreBar score={score} label={label} />
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{why}</p>
      {fixes && fixes.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {fixes.map((fix, i) => (
            <li key={i} className="text-foreground flex items-start gap-2 text-sm leading-relaxed">
              <span aria-hidden className="text-primary mt-0.5">
                →
              </span>
              <span>{fix}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function WinsAndFixes({
  wins,
  fixes,
  quickWin,
}: {
  wins: string[];
  fixes: string[];
  quickWin?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="border-success/30 bg-success/5 rounded-lg border p-4">
        <p className="text-success flex items-center gap-1.5 font-mono text-xs font-medium tracking-wider uppercase">
          <TrendingUp className="size-3.5" aria-hidden /> Top wins
        </p>
        <ul className="mt-3 space-y-2">
          {wins.map((w, i) => (
            <li key={i} className="text-foreground flex gap-2 text-sm leading-relaxed">
              <span className="text-success font-mono">{i + 1}.</span> {w}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-accent/30 bg-accent/5 rounded-lg border p-4">
        <p className="text-accent-foreground flex items-center gap-1.5 font-mono text-xs font-medium tracking-wider uppercase">
          <Lightbulb className="size-3.5" aria-hidden /> Top fixes (by ROI)
        </p>
        <ul className="mt-3 space-y-2">
          {fixes.map((f, i) => (
            <li key={i} className="text-foreground flex gap-2 text-sm leading-relaxed">
              <span className="text-accent-foreground font-mono">{i + 1}.</span> {f}
            </li>
          ))}
        </ul>
        {quickWin && (
          <div className="border-accent/30 mt-4 border-t pt-3">
            <p className="text-accent-foreground font-mono text-[10px] font-semibold tracking-wider uppercase">
              Quick win
            </p>
            <p className="text-foreground mt-1 text-sm">{quickWin}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function scoreTone(score: number) {
  if (score >= 80) {
    return {
      text: "text-success",
      stroke: "oklch(0.65 0.16 150)",
      bar: "oklch(0.65 0.16 150)",
    };
  }
  if (score >= 50) {
    return {
      text: "text-accent-foreground",
      stroke: "oklch(0.77 0.16 70)",
      bar: "oklch(0.77 0.16 70)",
    };
  }
  return {
    text: "text-destructive",
    stroke: "oklch(0.6 0.245 27)",
    bar: "oklch(0.6 0.245 27)",
  };
}
