import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
}

export function FeatureGrid({
  features,
  columns = 3,
  className,
}: {
  features: Feature[];
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid gap-4 sm:gap-6",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {features.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="border-border bg-card text-card-foreground card-hover group relative overflow-hidden rounded-2xl border p-6"
        >
          {/* Hover wash — appears on group-hover. */}
          <div
            aria-hidden
            className="from-primary/5 to-accent/5 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="relative">
            <span className="bg-primary/10 text-primary ring-primary/20 inline-flex size-11 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="text-foreground mt-4 text-base font-semibold sm:text-lg">{title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
