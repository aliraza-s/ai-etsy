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
    <ul className="divide-border border-border bg-card text-card-foreground divide-y rounded-xl border">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="hover:bg-secondary/40 group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
            >
              <span className="text-foreground text-sm font-medium sm:text-base">{item.q}</span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "text-muted-foreground size-4 flex-none transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              id={`faq-${i}`}
              role="region"
              hidden={!isOpen}
              className="text-muted-foreground px-5 pb-5 text-sm leading-relaxed"
            >
              {item.a}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
