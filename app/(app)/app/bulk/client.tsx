"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  Play,
  Square,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bulk runner.
 *
 * Pick a tool, paste N input rows (one per line — or one per blank-separated
 * block for the description tool), and run them in parallel against the
 * existing `/api/ai/<slug>` endpoint. Each row deducts credits + writes a
 * `Generation` + `UsageLog` row independently, so failures only burn the
 * specific row that failed.
 *
 * Concurrency is capped at 4 so we don't melt the AI provider or the
 * router's serializable credit transaction.
 */

type Slug = "tag-generator" | "title-generator" | "description-generator" | "keyword-generator";

interface Tool {
  slug: Slug;
  name: string;
  inputLabel: string;
  inputPlaceholder: string;
  /** "lines" splits on \n; "blocks" splits on \n\n+ (for multi-line per row). */
  splitMode: "lines" | "blocks";
  creditCost: number;
  /** Build the API body for one parsed row. */
  toBody: (row: string) => Record<string, unknown>;
  /** Render a one-line summary of an output row for the result table. */
  summary: (output: unknown) => string;
  /** Render the full output as a CSV-friendly string. */
  csvValue: (output: unknown) => string;
}

const TOOLS: Tool[] = [
  {
    slug: "tag-generator",
    name: "Tag Generator",
    inputLabel: "Product titles — one per line",
    inputPlaceholder:
      "Hand-poured vanilla soy candle 8oz amber jar\nChunky knit merino wool throw blanket 60x80\nMinimalist white oak desk organizer",
    splitMode: "lines",
    creditCost: 1,
    toBody: (row) => ({ productTitle: row }),
    summary: (out) => {
      const o = out as { tags?: string[] };
      return o.tags?.slice(0, 3).join(", ") + (o.tags && o.tags.length > 3 ? " …" : "") || "—";
    },
    csvValue: (out) => {
      const o = out as { tags?: string[] };
      return o.tags?.join(" | ") ?? "";
    },
  },
  {
    slug: "title-generator",
    name: "Title Generator",
    inputLabel: "Product descriptions — one per line",
    inputPlaceholder:
      "Hand-knit merino wool throw blanket, 60x80, cozy bed throw in oatmeal beige\nHand-poured vanilla soy candle in 8oz amber jar, 40hr burn time",
    splitMode: "lines",
    creditCost: 1,
    toBody: (row) => ({ productDescription: row }),
    summary: (out) => {
      const o = out as { titles?: string[] };
      return o.titles?.[0] ?? "—";
    },
    csvValue: (out) => {
      const o = out as { titles?: string[] };
      return o.titles?.join(" | ") ?? "";
    },
  },
  {
    slug: "keyword-generator",
    name: "Keyword Generator",
    inputLabel: "Seed keywords — one per line",
    inputPlaceholder: "soy candle\nminimalist desk decor\nwedding favor",
    splitMode: "lines",
    creditCost: 2,
    toBody: (row) => ({ seed: row }),
    summary: (out) => {
      const o = out as { keywords?: { phrase: string }[] };
      return (
        o.keywords
          ?.slice(0, 3)
          .map((k) => k.phrase)
          .join(", ") || "—"
      );
    },
    csvValue: (out) => {
      const o = out as { keywords?: { phrase: string; intent: string }[] };
      return o.keywords?.map((k) => `${k.phrase} (${k.intent})`).join(" | ") ?? "";
    },
  },
  {
    slug: "description-generator",
    name: "Description Generator",
    inputLabel: "Product bullet lists — one block per row (blank line between rows)",
    inputPlaceholder:
      "100% soy wax\nCotton wick\n8oz amber jar\n40-hour burn\n\nMerino wool\n60x80\nHand knit\nOatmeal color",
    splitMode: "blocks",
    creditCost: 3,
    toBody: (row) => ({
      productBullets: row
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      tone: "friendly",
    }),
    summary: (out) => {
      const o = out as { description?: string };
      return (
        o.description?.slice(0, 110) + (o.description && o.description.length > 110 ? " …" : "") ||
        "—"
      );
    },
    csvValue: (out) => {
      const o = out as { description?: string };
      return o.description?.replace(/\n/g, " ") ?? "";
    },
  },
];

type RowStatus = "queued" | "running" | "success" | "error" | "cancelled";

interface Row {
  index: number;
  input: string;
  status: RowStatus;
  output?: unknown;
  error?: string;
  creditsRemaining?: number;
  durationMs?: number;
}

const CONCURRENCY = 4;

export function BulkRunnerClient() {
  const [toolSlug, setToolSlug] = useState<Slug>("tag-generator");
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);

  const tool = useMemo(() => TOOLS.find((t) => t.slug === toolSlug)!, [toolSlug]);

  const parsedInputs = useMemo(() => {
    if (tool.splitMode === "blocks") {
      return text
        .split(/\r?\n\s*\r?\n/)
        .map((b) => b.trim())
        .filter(Boolean);
    }
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  }, [text, tool.splitMode]);

  const stats = useMemo(() => {
    const c = { queued: 0, running: 0, success: 0, error: 0, cancelled: 0 };
    for (const r of rows) c[r.status]++;
    return c;
  }, [rows]);

  const estimatedCredits = parsedInputs.length * tool.creditCost;

  async function start(e: FormEvent) {
    e.preventDefault();
    if (parsedInputs.length === 0) return;

    cancelRef.current = false;
    const initial: Row[] = parsedInputs.map((input, index) => ({
      index,
      input,
      status: "queued",
    }));
    setRows(initial);
    setRunning(true);

    // Simple bounded-concurrency worker pool.
    let nextIdx = 0;
    async function worker() {
      while (!cancelRef.current) {
        const idx = nextIdx++;
        if (idx >= initial.length) return;
        await runOne(idx);
      }
    }

    async function runOne(idx: number) {
      const start = Date.now();
      updateRow(idx, { status: "running" });
      try {
        const res = await fetch(`/api/ai/${tool.slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tool.toBody(initial[idx].input)),
        });
        const json = (await res.json().catch(() => ({}))) as {
          output?: unknown;
          creditsRemaining?: number;
          error?: string;
          message?: string;
          required?: number;
          available?: number;
        };
        if (!res.ok) {
          let msg = json.message ?? json.error ?? `HTTP ${res.status}`;
          if (json.error === "insufficient_credits") {
            msg = `Out of credits (need ${json.required}, have ${json.available})`;
            cancelRef.current = true; // stop the rest — they'll all fail
          }
          updateRow(idx, {
            status: cancelRef.current && idx > 0 ? "cancelled" : "error",
            error: msg,
            durationMs: Date.now() - start,
          });
          return;
        }
        updateRow(idx, {
          status: "success",
          output: json.output,
          creditsRemaining: json.creditsRemaining,
          durationMs: Date.now() - start,
        });
      } catch (err) {
        updateRow(idx, {
          status: "error",
          error: err instanceof Error ? err.message : "Unexpected error",
          durationMs: Date.now() - start,
        });
      }
    }

    function updateRow(idx: number, patch: Partial<Row>) {
      setRows((prev) => prev.map((r) => (r.index === idx ? { ...r, ...patch } : r)));
    }

    const workers = Array.from({ length: Math.min(CONCURRENCY, parsedInputs.length) }, () =>
      worker(),
    );
    await Promise.all(workers);

    // Mark any still-queued rows as cancelled if the user hit Stop.
    if (cancelRef.current) {
      setRows((prev) =>
        prev.map((r) => (r.status === "queued" ? { ...r, status: "cancelled" } : r)),
      );
    }
    setRunning(false);
  }

  function stop() {
    cancelRef.current = true;
  }

  function downloadCsv() {
    const headers = ["#", "input", "status", "output", "duration_ms", "error"];
    const lines = [headers.join(",")];
    for (const r of rows) {
      const out = r.status === "success" && r.output ? csvEscape(tool.csvValue(r.output)) : "";
      lines.push(
        [
          r.index + 1,
          csvEscape(r.input),
          r.status,
          out,
          r.durationMs ?? "",
          csvEscape(r.error ?? ""),
        ].join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bulk-${tool.slug}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">Bulk runner</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Run any generator across many inputs at once. Credits and history apply per row (failures
          only burn the row that failed). Capped at {CONCURRENCY} parallel requests so we don&apos;t
          melt the AI provider.
        </p>
      </div>

      <form onSubmit={start} className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="border-border bg-card text-card-foreground space-y-5 rounded-xl border p-6">
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">Tool</label>
            <div className="grid grid-cols-2 gap-2">
              {TOOLS.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => {
                    setToolSlug(t.slug);
                    setRows([]);
                  }}
                  disabled={running}
                  className={cn(
                    "rounded-md border px-3 py-2 text-left text-sm transition-colors disabled:opacity-50",
                    toolSlug === t.slug
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background text-muted-foreground hover:bg-secondary",
                  )}
                >
                  <p className="font-medium">{t.name}</p>
                  <p className="font-mono text-[10px] tracking-wider uppercase opacity-70">
                    {t.creditCost} cr · per row
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label className="text-foreground text-sm font-medium">{tool.inputLabel}</label>
              <span className="text-muted-foreground font-mono text-xs">
                {parsedInputs.length} rows · {estimatedCredits} cr
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={tool.inputPlaceholder}
              disabled={running}
              rows={12}
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-y rounded-md border px-3 py-2 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={running || parsedInputs.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {running ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Running…
                </>
              ) : (
                <>
                  <Play className="size-4" aria-hidden /> Run {parsedInputs.length} rows
                </>
              )}
            </button>
            {running && (
              <button
                type="button"
                onClick={stop}
                className="border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15 inline-flex h-11 items-center gap-1.5 rounded-md border px-4 text-sm font-medium transition-colors"
              >
                <Square className="size-4" aria-hidden /> Stop
              </button>
            )}
          </div>

          <p className="text-muted-foreground text-xs">
            Each row runs through the existing API endpoint, so credits, history, and admin
            analytics work exactly as they do for a single-row call.
          </p>
        </div>

        <div className="border-border bg-card text-card-foreground rounded-xl border p-6">
          {rows.length === 0 ? (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-center text-sm">
              <Play className="text-primary/40 size-8" aria-hidden />
              <p>Results will appear here, row by row.</p>
              <p className="text-xs">
                Paste your inputs on the left and hit Run. Output CSV at the end.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-border/60 flex flex-wrap items-baseline justify-between gap-2 border-b pb-3">
                <ul className="text-muted-foreground flex flex-wrap items-center gap-x-3 font-mono text-xs">
                  <li className="text-success">✓ {stats.success}</li>
                  <li className="text-destructive">✗ {stats.error}</li>
                  {stats.cancelled > 0 && <li>⊘ {stats.cancelled}</li>}
                  {stats.running > 0 && <li className="text-primary">… {stats.running}</li>}
                  {stats.queued > 0 && <li>· {stats.queued}</li>}
                </ul>
                {!running && stats.success > 0 && (
                  <button
                    type="button"
                    onClick={downloadCsv}
                    className="border-border bg-background hover:bg-secondary text-foreground inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs transition-colors"
                  >
                    <Download className="size-3.5" aria-hidden /> Export CSV
                  </button>
                )}
              </div>

              <ul className="space-y-1.5">
                {rows.map((row) => (
                  <li
                    key={row.index}
                    className="border-border/60 bg-background flex items-start gap-3 rounded-md border p-2.5 text-sm"
                  >
                    <span className="text-muted-foreground w-6 shrink-0 text-right font-mono text-xs">
                      {row.index + 1}
                    </span>
                    <StatusIcon status={row.status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate font-medium">{row.input}</p>
                      {row.status === "success" && row.output != null && (
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          → {tool.summary(row.output)}
                        </p>
                      )}
                      {row.status === "error" && row.error && (
                        <p className="text-destructive mt-0.5 truncate text-xs">{row.error}</p>
                      )}
                      {row.status === "cancelled" && (
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          cancelled — credits not deducted
                        </p>
                      )}
                    </div>
                    {row.durationMs != null && (
                      <span className="text-muted-foreground shrink-0 font-mono text-xs">
                        {row.durationMs}ms
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <p className="text-muted-foreground text-xs">
                <Link href="/app/history" className="hover:text-foreground transition-colors">
                  Each successful row is in your generation history →
                </Link>
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function StatusIcon({ status }: { status: RowStatus }) {
  if (status === "success") {
    return <CheckCircle2 className="text-success mt-0.5 size-4 shrink-0" aria-hidden />;
  }
  if (status === "error") {
    return <XCircle className="text-destructive mt-0.5 size-4 shrink-0" aria-hidden />;
  }
  if (status === "cancelled") {
    return <AlertTriangle className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden />;
  }
  if (status === "running") {
    return <Loader2 className="text-primary mt-0.5 size-4 shrink-0 animate-spin" aria-hidden />;
  }
  return (
    <span
      aria-hidden
      className="bg-muted text-muted-foreground mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[10px]"
    >
      ·
    </span>
  );
}

function csvEscape(s: string): string {
  if (s == null) return "";
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
