"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ToolShellProps<TInput, TOutput> {
  /** URL slug — matches the API endpoint `/api/ai/{slug}`. */
  slug: string;
  /** Display name (e.g., "Tag Generator"). */
  name: string;
  /** One-sentence pitch shown beneath the H1. */
  blurb: string;
  /** Credit cost shown in the submit button. */
  creditCost: number;
  /** Initial form state. */
  initialInput: TInput;
  /** Render the form inputs. Use the bag for controlled inputs. */
  renderForm: (bag: {
    input: TInput;
    setField: <K extends keyof TInput>(k: K, v: TInput[K]) => void;
    submitting: boolean;
  }) => ReactNode;
  /** Render the AI output when present. */
  renderOutput: (output: TOutput) => ReactNode;
  /** Transform form state to API body. Defaults to identity. */
  transformBody?: (input: TInput) => unknown;
}

interface ApiSuccess<TOutput> {
  generationId: string;
  output: TOutput;
  modelUsed: string;
  provider: string;
  creditsUsed: number;
  creditsRemaining: number;
}

export function ToolShell<TInput extends Record<string, unknown>, TOutput>({
  slug,
  name,
  blurb,
  creditCost,
  initialInput,
  renderForm,
  renderOutput,
  transformBody,
}: ToolShellProps<TInput, TOutput>) {
  const [input, setInput] = useState<TInput>(initialInput);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ApiSuccess<TOutput> | null>(null);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof TInput>(k: K, v: TInput[K]) {
    setInput((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const body = transformBody ? transformBody(input) : input;
      const res = await fetch(`/api/ai/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
          required?: number;
          available?: number;
        };
        if (body.error === "insufficient_credits") {
          setError(
            `Out of credits. Need ${body.required}, have ${body.available}. Upgrade or wait for monthly reset.`,
          );
        } else if (body.error === "validation_failed") {
          setError("Check your inputs — one or more fields didn't validate.");
        } else {
          setError(body.message ?? body.error ?? `Request failed (${res.status})`);
        }
        return;
      }
      const json = (await res.json()) as ApiSuccess<TOutput>;
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">{name}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{blurb}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={onSubmit}
          className="border-border bg-card text-card-foreground space-y-5 rounded-xl border p-6"
        >
          {renderForm({ input, setField, submitting })}
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:opacity-60",
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden />
                Generate ({creditCost} {creditCost === 1 ? "credit" : "credits"})
              </>
            )}
          </button>
          {error && (
            <p
              role="alert"
              className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm"
            >
              {error}
            </p>
          )}
        </form>

        <div className="border-border bg-card text-card-foreground rounded-xl border p-6">
          {!result && !submitting && <EmptyState />}
          {submitting && (
            <div className="text-muted-foreground flex h-full items-center justify-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              <span>Asking the model…</span>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div className="border-border/60 flex items-baseline justify-between border-b pb-3 text-xs">
                <span className="text-muted-foreground font-mono">
                  {result.modelUsed} · {result.provider.toLowerCase()}
                </span>
                <span className="text-muted-foreground font-mono">
                  {result.creditsRemaining} credits left
                </span>
              </div>
              {renderOutput(result.output)}
              <div className="border-border/60 flex items-center justify-between border-t pt-4 text-xs">
                <Link
                  href="/app/history"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Saved to history →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setError(null);
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-center text-sm">
      <Sparkles className="text-primary/40 size-8" aria-hidden />
      <p>Fill in the form and hit generate.</p>
      <p className="text-xs">Results appear here in seconds.</p>
    </div>
  );
}

// ─── Common input primitives ─────────────────────────────────────────────────

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
  disabled,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-foreground text-sm font-medium">{label}</label>
        {maxLength != null && (
          <span className="text-muted-foreground font-mono text-xs">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-full rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
      />
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  hint,
  disabled,
  rows = 4,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-foreground text-sm font-medium">{label}</label>
        {maxLength != null && (
          <span className="text-muted-foreground font-mono text-xs">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-y rounded-md border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
      />
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="border-border bg-background hover:bg-secondary text-muted-foreground hover:text-foreground inline-flex h-7 items-center rounded border px-2 text-xs transition-colors"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
