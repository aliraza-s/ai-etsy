"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, FlaskConical, RotateCcw } from "lucide-react";
import type { AIProvider, Tool } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Card } from "@/components/admin/admin-primitives";

interface ConfigState {
  provider: AIProvider;
  model: string;
  fallbackProvider: AIProvider | null;
  fallbackModel: string | null;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

const PROVIDERS: AIProvider[] = ["ANTHROPIC", "OPENROUTER", "TOGETHER"];

interface TestResult {
  ok: boolean;
  durationMs: number;
  output?: unknown;
  modelUsed?: string;
  provider?: string;
  error?: string;
}

export function AIConfigEditor({
  tool,
  slug,
  initial,
}: {
  tool: Tool;
  slug: string;
  initial: ConfigState;
}) {
  const router = useRouter();
  const [state, setState] = useState<ConfigState>(initial);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  function setField<K extends keyof ConfigState>(k: K, v: ConfigState[K]) {
    setState((prev) => ({ ...prev, [k]: v }));
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/admin/ai-config/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) {
        setSaveMsg({ ok: false, text: json.message ?? json.error ?? `Failed (${res.status})` });
      } else {
        setSaveMsg({ ok: true, text: "Saved. Live within 60s." });
        router.refresh();
      }
    } catch (err) {
      setSaveMsg({ ok: false, text: err instanceof Error ? err.message : "Unexpected error" });
    } finally {
      setSaving(false);
    }
  }

  async function onTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/admin/ai-config/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, ...state }),
      });
      const json = (await res.json()) as TestResult & { error?: string };
      if (!res.ok) {
        setTestResult({ ok: false, durationMs: 0, error: json.error ?? `Failed (${res.status})` });
      } else {
        setTestResult(json);
      }
    } catch (err) {
      setTestResult({
        ok: false,
        durationMs: 0,
        error: err instanceof Error ? err.message : "Unexpected error",
      });
    } finally {
      setTesting(false);
    }
  }

  function reset() {
    setState(initial);
    setSaveMsg(null);
    setTestResult(null);
  }

  const dirty = JSON.stringify(state) !== JSON.stringify(initial);

  return (
    <form onSubmit={onSave} className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Primary provider">
            <Select
              value={state.provider}
              onChange={(v) => setField("provider", v as AIProvider)}
              options={PROVIDERS}
            />
          </Field>
          <Field label="Primary model">
            <Input
              value={state.model}
              onChange={(v) => setField("model", v)}
              placeholder="claude-haiku-4-5-20251001"
            />
          </Field>
          <Field label="Fallback provider (optional)">
            <Select
              value={state.fallbackProvider ?? ""}
              onChange={(v) => setField("fallbackProvider", v ? (v as AIProvider) : null)}
              options={["", ...PROVIDERS]}
              renderOption={(o) => (o === "" ? "— none —" : o)}
            />
          </Field>
          <Field label="Fallback model">
            <Input
              value={state.fallbackModel ?? ""}
              onChange={(v) => setField("fallbackModel", v || null)}
              placeholder="qwen/qwen-2.5-7b-instruct"
              disabled={!state.fallbackProvider}
            />
          </Field>
          <Field label="Temperature" hint="0 = deterministic, 1 = creative">
            <Input
              type="number"
              step={0.1}
              min={0}
              max={2}
              value={String(state.temperature)}
              onChange={(v) => setField("temperature", Math.max(0, Math.min(2, Number(v) || 0)))}
            />
          </Field>
          <Field label="Max output tokens">
            <Input
              type="number"
              step={64}
              min={64}
              max={16384}
              value={String(state.maxTokens)}
              onChange={(v) =>
                setField("maxTokens", Math.max(64, Math.min(16384, Number(v) || 1024)))
              }
            />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="mb-2 flex items-baseline justify-between">
          <label className="text-foreground text-sm font-medium">System prompt</label>
          <span className="text-muted-foreground font-mono text-xs">
            {state.systemPrompt.length} chars
          </span>
        </div>
        <textarea
          value={state.systemPrompt}
          onChange={(e) => setField("systemPrompt", e.target.value)}
          rows={10}
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-y rounded-md border px-3 py-2 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        />
        <p className="text-muted-foreground mt-2 text-xs">
          The router sends this verbatim as the system message. The user prompt is built per-tool
          from validated input (see <code className="font-mono">buildUserPrompt</code>).
        </p>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving || !dirty}
          className={cn(
            "bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-50",
          )}
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Save className="size-4" aria-hidden />
          )}
          Save changes
        </button>
        <button
          type="button"
          onClick={onTest}
          disabled={testing}
          className="border-border bg-card hover:bg-secondary inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {testing ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <FlaskConical className="size-4" aria-hidden />
          )}
          Test with sample input
        </button>
        {dirty && (
          <button
            type="button"
            onClick={reset}
            className="text-muted-foreground hover:text-foreground inline-flex h-10 items-center gap-1.5 px-2 text-xs transition-colors"
          >
            <RotateCcw className="size-3.5" aria-hidden /> Reset
          </button>
        )}
        {saveMsg && (
          <span
            role="status"
            className={cn(
              "ml-auto rounded-md px-3 py-1.5 text-xs",
              saveMsg.ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
            )}
          >
            {saveMsg.text}
          </span>
        )}
      </div>

      {testResult && (
        <Card className={cn(testResult.ok ? "border-success/40" : "border-destructive/40")}>
          <div className="flex items-baseline justify-between">
            <p
              className={cn(
                "font-mono text-xs tracking-wider uppercase",
                testResult.ok ? "text-success" : "text-destructive",
              )}
            >
              {testResult.ok ? "Test passed" : "Test failed"}
            </p>
            <span className="text-muted-foreground font-mono text-xs">
              {testResult.durationMs}ms
              {testResult.modelUsed ? ` · ${testResult.modelUsed}` : ""}
            </span>
          </div>
          {testResult.error && <p className="text-destructive mt-3 text-sm">{testResult.error}</p>}
          {testResult.ok && (
            <pre className="bg-muted/30 mt-3 max-h-80 overflow-auto rounded-md p-3 font-mono text-[11px] leading-relaxed">
              {JSON.stringify(testResult.output, null, 2)}
            </pre>
          )}
          <p className="text-muted-foreground mt-3 text-xs">
            Test calls use a canned sample input and do NOT deduct credits or write to UsageLog.
          </p>
        </Card>
      )}
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-foreground mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-muted-foreground mt-1 block text-xs">{hint}</span>}
    </label>
  );
}

function Input(props: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type={props.type ?? "text"}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      disabled={props.disabled}
      step={props.step}
      min={props.min}
      max={props.max}
      className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
    />
  );
}

function Select<T extends string>(props: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  renderOption?: (v: T) => string;
}) {
  return (
    <select
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as T)}
      className="border-input bg-background text-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      {props.options.map((o) => (
        <option key={o} value={o}>
          {props.renderOption ? props.renderOption(o) : o}
        </option>
      ))}
    </select>
  );
}
