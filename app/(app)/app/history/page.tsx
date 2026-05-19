import type { Metadata } from "next";
import Link from "next/link";
import { History as HistoryIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { TOOL_ENUM_TO_SLUG } from "@/lib/ai/schemas";

export const metadata: Metadata = { title: "History" };

const TOOL_LABEL: Record<string, string> = {
  TAG_GENERATOR: "Tag Generator",
  TITLE_GENERATOR: "Title Generator",
  KEYWORD_GENERATOR: "Keyword Generator",
  DESCRIPTION_GENERATOR: "Description Generator",
  LISTING_ANALYZER: "Listing Analyzer",
  SHOP_ANALYZER: "Shop Analyzer",
};

function summarize(tool: string, output: unknown): string {
  if (!output || typeof output !== "object") return "—";
  const o = output as Record<string, unknown>;
  if (tool === "TAG_GENERATOR" && Array.isArray(o.tags)) {
    return (o.tags as string[]).slice(0, 5).join(", ") + (o.tags.length > 5 ? ", …" : "");
  }
  if (tool === "TITLE_GENERATOR" && Array.isArray(o.titles)) {
    return (o.titles as string[])[0] ?? "—";
  }
  if (tool === "KEYWORD_GENERATOR" && Array.isArray(o.keywords)) {
    return (
      (o.keywords as { phrase: string }[])
        .slice(0, 4)
        .map((k) => k.phrase)
        .join(", ") + (o.keywords.length > 4 ? ", …" : "")
    );
  }
  if (tool === "DESCRIPTION_GENERATOR" && typeof o.description === "string") {
    return (o.description as string).slice(0, 140) + (o.description.length > 140 ? "…" : "");
  }
  if (tool === "LISTING_ANALYZER" && typeof o.score === "number") {
    const top = Array.isArray(o.topFixes) ? (o.topFixes as string[])[0] : null;
    return `Score ${o.score}/100${top ? ` — fix: ${top}` : ""}`;
  }
  if (tool === "SHOP_ANALYZER" && typeof o.overallScore === "number") {
    const top = Array.isArray(o.topFixes) ? (o.topFixes as string[])[0] : null;
    return `Score ${o.overallScore}/100${top ? ` — fix: ${top}` : ""}`;
  }
  return "—";
}

export default async function HistoryPage() {
  const session = await auth();
  const userId = session!.user.id;

  const generations = await db.generation.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-foreground text-3xl font-semibold tracking-tight">History</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Your last 50 generations. We never delete these unless you ask.
      </p>

      {generations.length === 0 ? (
        <div className="border-border bg-card text-card-foreground mt-8 rounded-xl border p-12 text-center">
          <HistoryIcon className="text-muted-foreground mx-auto size-8" aria-hidden />
          <p className="text-foreground mt-3 text-base font-medium">No generations yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Run a tool and your results will land here.
          </p>
          <div className="mt-5 inline-flex gap-2">
            <Link
              href="/app/tag-generator"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors"
            >
              Try the Tag Generator
            </Link>
          </div>
        </div>
      ) : (
        <ul className="border-border bg-card text-card-foreground divide-border/60 mt-8 divide-y rounded-xl border">
          {generations.map((gen) => {
            const slug = TOOL_ENUM_TO_SLUG[gen.tool] ?? "";
            return (
              <li key={gen.id} className="hover:bg-secondary/30 transition-colors">
                <Link
                  href={`/app/${slug}`}
                  className="grid gap-3 p-5 sm:grid-cols-[180px_1fr_auto] sm:items-start"
                >
                  <div>
                    <span className="bg-primary/10 text-primary inline-block rounded px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                      {TOOL_LABEL[gen.tool] ?? gen.tool}
                    </span>
                    <p className="text-muted-foreground mt-2 font-mono text-xs">
                      {gen.createdAt.toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground text-sm leading-relaxed">
                      {summarize(gen.tool, gen.output)}
                    </p>
                  </div>
                  <div className="text-muted-foreground self-center font-mono text-xs">
                    {gen.isPinned ? "📌" : ""}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
