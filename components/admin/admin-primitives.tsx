import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("border-border bg-card text-card-foreground rounded-xl border p-5", className)}
    >
      {children}
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon?: ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "success" | "warn" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "warn"
        ? "text-accent-foreground"
        : tone === "danger"
          ? "text-destructive"
          : "text-foreground";
  return (
    <Card>
      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase">
        {icon} {label}
      </div>
      <p className={cn("mt-2 text-2xl font-semibold tabular-nums", toneClass)}>{value}</p>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </Card>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warn" | "danger" | "info";
}) {
  const cls =
    tone === "success"
      ? "border-success/30 bg-success/10 text-success"
      : tone === "warn"
        ? "border-accent/30 bg-accent/10 text-accent-foreground"
        : tone === "danger"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : tone === "info"
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase",
        cls,
      )}
    >
      {children}
    </span>
  );
}

export function DataTable({
  headers,
  rows,
  empty = "No rows.",
}: {
  headers: string[];
  rows: ReactNode[][];
  empty?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="border-border bg-card text-muted-foreground rounded-xl border p-8 text-center text-sm">
        {empty}
      </div>
    );
  }
  return (
    <div className="border-border bg-card overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-border/60 bg-muted/30 border-b">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="text-muted-foreground px-4 py-2.5 text-left font-mono text-xs font-medium tracking-wider uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-border/40 hover:bg-muted/30 border-b transition-colors last:border-b-0"
            >
              {row.map((cell, j) => (
                <td key={j} className="text-foreground px-4 py-3 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function formatUsd(value: number, fractionDigits = 2): string {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const ms = Date.now() - d.getTime();
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}
