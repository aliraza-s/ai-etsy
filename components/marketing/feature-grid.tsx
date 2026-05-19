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
        "grid gap-6 sm:gap-8",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {features.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="border-border bg-card text-card-foreground hover:border-primary/30 group rounded-xl border p-6 transition-colors"
        >
          <span className="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-md transition-transform group-hover:scale-110">
            <Icon className="size-5" aria-hidden />
          </span>
          <h3 className="text-foreground mt-4 text-base font-semibold">{title}</h3>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{body}</p>
        </li>
      ))}
    </ul>
  );
}
