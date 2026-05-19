"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const TOPICS = [
  { value: "general", label: "General / product question" },
  { value: "billing", label: "Billing or refund" },
  { value: "bug", label: "Bug report" },
  { value: "feature", label: "Feature request" },
  { value: "partnership", label: "Partnership / press" },
  { value: "other", label: "Other" },
] as const;

type Topic = (typeof TOPICS)[number]["value"];

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<Topic>("general");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message, website }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        setError(json.message ?? json.error ?? `Failed (${res.status}). Try emailing us directly.`);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="border-success/40 bg-success/5 rounded-xl border p-6 text-center">
        <CheckCircle2 className="text-success mx-auto size-10" aria-hidden />
        <h3 className="text-foreground mt-3 text-lg font-semibold">Message received.</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          We&apos;ll reply to <span className="text-foreground font-medium">{email}</span> within 24
          hours. Thanks for writing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot — hidden from sighted users, ignored by humans, filled by bots. */}
      <label className="sr-only" aria-hidden>
        Website
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name">
          <Input value={name} onChange={setName} required maxLength={120} disabled={submitting} />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            value={email}
            onChange={setEmail}
            required
            maxLength={200}
            disabled={submitting}
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <Field label="Topic">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value as Topic)}
          disabled={submitting}
          className="border-input bg-background text-foreground focus-visible:ring-ring h-11 w-full rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" hint={`${message.length}/3000`}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          maxLength={3000}
          rows={6}
          disabled={submitting}
          placeholder="Tell us what you need. Include screenshots, listing URLs, or example output where relevant — it helps us reply with something useful."
          className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-y rounded-md border px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
        />
      </Field>

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
            Sending…
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden />
            Send message
          </>
        )}
      </button>

      {error && (
        <p role="alert" className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
          {error}
        </p>
      )}

      <p className="text-muted-foreground text-center text-xs">
        We use this only to reply. No marketing list signup. See our Privacy Policy.
      </p>
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
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-foreground text-sm font-medium">{label}</span>
        {hint && <span className="text-muted-foreground font-mono text-xs">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Input(props: {
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  maxLength?: number;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      type={props.type ?? "text"}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      required={props.required}
      maxLength={props.maxLength}
      disabled={props.disabled}
      placeholder={props.placeholder}
      className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-11 w-full rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
    />
  );
}
