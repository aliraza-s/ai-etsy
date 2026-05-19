/**
 * Centralized error reporting.
 *
 * Defaults to `console.error` so local development surfaces everything.
 * When `SENTRY_DSN` is set AND `@sentry/nextjs` is installed, the dynamic
 * import is reached and Sentry receives the report.
 *
 * To enable Sentry:
 *   1. pnpm add @sentry/nextjs
 *   2. Set SENTRY_DSN in your environment
 *   3. (Optional) Run `npx @sentry/wizard@latest -i nextjs` for full
 *      source-map upload + tunneling config — this file works without it.
 *
 * Until both are in place this module is a no-op wrapper around console.
 */

type Context = Record<string, unknown>;

interface SentryShape {
  captureException(err: unknown, captureContext?: { extra?: Context; tags?: Context }): void;
  captureMessage(message: string, captureContext?: { extra?: Context; level?: string }): void;
}

let sentryLoadAttempted = false;
let sentryInstance: SentryShape | null = null;

async function getSentry(): Promise<SentryShape | null> {
  if (sentryLoadAttempted) return sentryInstance;
  sentryLoadAttempted = true;
  if (!process.env.SENTRY_DSN) return null;
  try {
    // Dynamic, indirect import — the literal string is hidden from TS/bundlers
    // so the file compiles even when `@sentry/nextjs` isn't installed.
    const spec = "@sentry/nextjs";
    const mod = (await (Function("s", "return import(s)") as (s: string) => Promise<unknown>)(
      spec,
    ).catch(() => null)) as SentryShape | null;
    sentryInstance = mod ?? null;
  } catch {
    sentryInstance = null;
  }
  return sentryInstance;
}

export function logError(err: unknown, context?: Context): void {
  console.error("[error]", err, context ?? {});
  void getSentry().then((s) => {
    s?.captureException(err, { extra: context });
  });
}

export function logWarn(message: string, context?: Context): void {
  console.warn("[warn]", message, context ?? {});
  void getSentry().then((s) => {
    s?.captureMessage(message, { extra: context, level: "warning" });
  });
}
