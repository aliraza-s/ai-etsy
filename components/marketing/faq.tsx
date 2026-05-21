"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="divide-border border-border bg-card text-card-foreground divide-y overflow-hidden rounded-2xl border shadow-sm">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q} className={cn(isOpen && "bg-secondary/30")}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="hover:bg-secondary/40 group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors sm:px-6"
            >
              <span className="text-foreground text-sm font-medium sm:text-base">{item.q}</span>
              <span
                aria-hidden
                className={cn(
                  "border-border bg-background text-muted-foreground inline-flex size-7 flex-none items-center justify-center rounded-full border transition-all",
                  isOpen && "border-primary/30 bg-primary/10 text-primary",
                )}
              >
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </span>
            </button>
            <div
              id={`faq-${i}`}
              role="region"
              hidden={!isOpen}
              className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed sm:px-6"
            >
              {item.a}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
