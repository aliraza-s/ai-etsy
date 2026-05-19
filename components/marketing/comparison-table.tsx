import { Check, Minus, X } from "lucide-react";

export interface ComparisonColumn {
  label: string;
  /** Mark this column as the highlighted (our-product) one. */
  highlight?: boolean;
}

export interface ComparisonRow {
  feature: string;
  /** Values aligned to columns: true / false / a short string. */
  values: (boolean | string)[];
}

/**
 * Comparison table. Google AI Overviews and Perplexity cite comparison tables
 * at ~3× the rate of prose, so we render an explicit grid with semantic markup.
 */
export function ComparisonTable({
  columns,
  rows,
  caption,
}: {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  caption?: string;
}) {
  return (
    <div className="border-border bg-card text-card-foreground overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        {caption && <caption className="text-muted-foreground p-3 text-xs">{caption}</caption>}
        <thead>
          <tr className="border-border/60 border-b">
            <th
              scope="col"
              className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase"
            >
              Feature
            </th>
            {columns.map((col) => (
              <th
                key={col.label}
                scope="col"
                className={
                  col.highlight
                    ? "text-primary px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                    : "text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase"
                }
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-border/60 divide-y">
          {rows.map((row) => (
            <tr key={row.feature}>
              <th scope="row" className="text-foreground px-4 py-3 text-left text-sm font-medium">
                {row.feature}
              </th>
              {row.values.map((value, i) => (
                <td
                  key={i}
                  className={columns[i]?.highlight ? "bg-primary/5 px-4 py-3" : "px-4 py-3"}
                >
                  <CellValue value={value} highlight={columns[i]?.highlight} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CellValue({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  if (value === true) {
    return (
      <span
        className={
          highlight
            ? "bg-primary/15 text-primary inline-flex size-6 items-center justify-center rounded-full"
            : "bg-success/15 text-success inline-flex size-6 items-center justify-center rounded-full"
        }
        title="Yes"
      >
        <Check className="size-3.5" aria-hidden />
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        className="bg-muted text-muted-foreground inline-flex size-6 items-center justify-center rounded-full"
        title="No"
      >
        <X className="size-3.5" aria-hidden />
        <span className="sr-only">No</span>
      </span>
    );
  }
  if (value === "—") {
    return (
      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
        <Minus className="size-3.5" aria-hidden /> n/a
      </span>
    );
  }
  return <span className="text-foreground text-sm">{value}</span>;
}
