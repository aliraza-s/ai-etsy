"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Period = "monthly" | "annual";

interface Plan {
  name: string;
  description: string;
  credits: string;
  highlight?: boolean;
  prices: {
    monthly: { amount: string; cadence: string };
    annual: { amount: string; cadence: string; savings?: string };
  };
  cta: { href: string; label: string };
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: "Free",
    description: "Test the tools, build the habit.",
    credits: "15 credits / month",
    prices: {
      monthly: { amount: "$0", cadence: "forever" },
      annual: { amount: "$0", cadence: "forever" },
    },
    cta: { href: "/signin", label: "Start free" },
    features: [
      "Tag, title generators",
      "Keyword and description generators",
      "Listing analyzer (Haiku)",
      "Free fee calculator + events calendar",
      "Personal history",
    ],
  },
  {
    name: "Pro",
    description: "Built for active sellers shipping every week.",
    credits: "200 credits / month",
    highlight: true,
    prices: {
      monthly: { amount: "$5.99", cadence: "/ month" },
      annual: { amount: "$49", cadence: "/ year", savings: "2 months free" },
    },
    cta: { href: "/signin?plan=pro", label: "Choose Pro" },
    features: [
      "Everything in Free",
      "200 credits — ~50 full listings",
      "All AI generators",
      "Listing & shop analyzers (Haiku)",
      "Priority support",
    ],
  },
  {
    name: "Max",
    description: "For power sellers and shops with 100+ listings.",
    credits: "600 credits / month",
    prices: {
      monthly: { amount: "$11.99", cadence: "/ month" },
      annual: { amount: "$99", cadence: "/ year", savings: "2 months free" },
    },
    cta: { href: "/signin?plan=max", label: "Choose Max" },
    features: [
      "Everything in Pro",
      "600 credits — heavy workflows",
      "Claude Sonnet 4.6 on analyzers",
      "Deeper audits, more nuance",
      "Annual plan: 30-day money-back",
    ],
  },
];

export function PricingTable() {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <div>
      <div className="mb-10 flex items-center justify-center">
        <div className="border-border bg-card text-card-foreground inline-flex rounded-full border p-1">
          <button
            type="button"
            onClick={() => setPeriod("monthly")}
            aria-pressed={period === "monthly"}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              period === "monthly"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setPeriod("annual")}
            aria-pressed={period === "annual"}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              period === "annual"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Annual
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                period === "annual"
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "bg-accent/15 text-accent-foreground",
              )}
            >
              −2 mo
            </span>
          </button>
        </div>
      </div>

      <ul className="grid items-stretch gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const price = plan.prices[period];
          return (
            <li key={plan.name}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-6 transition-colors sm:p-8",
                  plan.highlight
                    ? "border-primary/40 bg-card text-card-foreground shadow-primary/5 shadow-lg"
                    : "border-border bg-card text-card-foreground",
                )}
              >
                {plan.highlight && (
                  <p className="text-primary mb-3 font-mono text-xs font-medium tracking-wider uppercase">
                    Most popular
                  </p>
                )}
                <h3 className="text-foreground text-xl font-semibold tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">{plan.description}</p>
                <p className="text-muted-foreground mt-4 font-mono text-xs">{plan.credits}</p>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-foreground text-4xl font-semibold tabular-nums">
                    {price.amount}
                  </span>
                  <span className="text-muted-foreground text-sm">{price.cadence}</span>
                </div>
                {period === "annual" && "savings" in price && price.savings && (
                  <p className="text-accent-foreground mt-1 text-xs">Save {price.savings}</p>
                )}

                <Link
                  href={plan.cta.href}
                  className={cn(
                    "mt-6 inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border bg-background hover:bg-secondary border",
                  )}
                >
                  {plan.cta.label}
                </Link>

                <ul className="text-muted-foreground mt-6 space-y-2.5 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check className="text-primary mt-0.5 size-4 flex-none" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
