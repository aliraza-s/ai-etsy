"use client";

import { useMemo, useState } from "react";
import { Calendar, Globe, Package, Truck } from "lucide-react";
import {
  ALL_CATEGORIES,
  ALL_REGIONS,
  CATEGORY_LABELS,
  EVENTS,
  REGION_LABELS,
  type EventCategory,
  type Region,
} from "@/lib/content/events";
import { cn } from "@/lib/utils";

const ALL = "ALL" as const;

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y!, m! - 1, d!));
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateShort(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y!, m! - 1, d!));
  return date.toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric" });
}

function daysUntil(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(y!, m! - 1, d!)).getTime();
  const today = Date.now();
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function EventsCalendar() {
  const [category, setCategory] = useState<EventCategory | typeof ALL>(ALL);
  const [region, setRegion] = useState<Region | typeof ALL>(ALL);

  const events = useMemo(() => {
    return EVENTS.filter((e) => {
      if (category !== ALL && e.category !== category) return false;
      if (region !== ALL && !e.regions.includes(region)) return false;
      return true;
    });
  }, [category, region]);

  return (
    <div className="border-border bg-card text-card-foreground rounded-2xl border shadow-sm">
      {/* Filters */}
      <div className="border-border/60 flex flex-wrap items-center gap-3 border-b p-4 sm:p-6">
        <FilterChip
          label="Category"
          value={category}
          onChange={(v) => setCategory(v as EventCategory | typeof ALL)}
          options={[
            { value: ALL, label: "All categories" },
            ...ALL_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
          ]}
        />
        <FilterChip
          label="Region"
          value={region}
          onChange={(v) => setRegion(v as Region | typeof ALL)}
          options={[
            { value: ALL, label: "All regions" },
            ...ALL_REGIONS.map((r) => ({ value: r, label: REGION_LABELS[r] })),
          ]}
        />
        <p className="text-muted-foreground ml-auto font-mono text-xs">
          {events.length} event{events.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* List */}
      {events.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground text-sm">
            No events match those filters. Try widening the region or category.
          </p>
        </div>
      ) : (
        <ul className="divide-border/60 divide-y">
          {events.map((event) => {
            const days = daysUntil(event.date);
            const upcoming = days >= 0 && days <= 60;
            return (
              <li key={event.slug} className="hover:bg-secondary/30 transition-colors">
                <div className="grid gap-4 p-4 sm:grid-cols-[140px_1fr] sm:p-6">
                  <div>
                    <p className="text-foreground text-2xl font-semibold tabular-nums">
                      {fmtDateShort(event.date)}
                    </p>
                    <p className="text-muted-foreground font-mono text-xs">{fmtDate(event.date)}</p>
                    {upcoming && (
                      <span className="bg-accent/15 text-accent-foreground mt-2 inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold">
                        {days <= 0 ? "happening now" : `${days}d to go`}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-foreground text-base font-semibold">{event.name}</h3>
                      <span className="bg-secondary text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase">
                        {CATEGORY_LABELS[event.category]}
                      </span>
                      {event.regions.map((r) => (
                        <span
                          key={r}
                          className="border-border bg-background text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-[10px]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {event.description}
                    </p>
                    <dl className="text-muted-foreground mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Package className="text-accent size-3" aria-hidden />
                        <dt className="font-medium">List by:</dt>
                        <dd className="text-foreground font-mono tabular-nums">
                          {fmtDate(event.prep)}
                        </dd>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Truck className="text-primary size-3" aria-hidden />
                        <dt className="font-medium">Ship by (US):</dt>
                        <dd className="text-foreground font-mono tabular-nums">
                          {fmtDate(event.ship)}
                        </dd>
                      </div>
                    </dl>
                    {event.niches.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {event.niches.map((niche) => (
                          <span
                            key={niche}
                            className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs"
                          >
                            {niche}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="border-border/60 bg-secondary/20 flex flex-wrap items-center justify-between gap-3 border-t p-4 text-xs sm:p-6">
        <div className="text-muted-foreground flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3" aria-hidden /> 2026 dates
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe className="size-3" aria-hidden /> {ALL_REGIONS.length} regions
          </span>
        </div>
        <p className="text-muted-foreground">Ship-by dates are US domestic guidance.</p>
      </div>
    </div>
  );
}

function FilterChip<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={label}
        className={cn(
          "border-input bg-background text-foreground focus-visible:ring-ring h-9 rounded-md border px-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
