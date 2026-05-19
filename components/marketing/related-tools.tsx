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
            className="border-border bg-card text-card-foreground hover:border-primary/40 hover:bg-secondary/40 group flex h-full flex-col justify-between gap-3 rounded-xl border p-5 transition-colors"
          >
            <div>
              <h3 className="text-foreground flex items-center gap-1.5 text-base font-semibold">
                {tool.title}
                <ArrowUpRight
                  aria-hidden
                  className="text-muted-foreground group-hover:text-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
