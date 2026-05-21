import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface RelatedTool {
  href: string;
  title: string;
  body: string;
}

export function RelatedTools({ tools }: { tools: RelatedTool[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <li key={tool.href}>
          <Link
            href={tool.href}
            className="border-border bg-card text-card-foreground card-hover group relative flex h-full flex-col justify-between gap-3 overflow-hidden rounded-2xl border p-5"
          >
            <div
              aria-hidden
              className="from-primary/0 to-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="relative">
              <h3 className="text-foreground flex items-center justify-between gap-1.5 text-base font-semibold">
                <span>{tool.title}</span>
                <ArrowUpRight
                  aria-hidden
                  className="text-muted-foreground group-hover:text-primary size-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{tool.body}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
