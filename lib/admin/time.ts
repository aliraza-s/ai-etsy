/**
 * Time helpers for server components.
 *
 * Server components are async functions re-run per request — they are not subject
 * to the React purity rule. We extract `Date.now()` into helpers so the rule
 * (`react-hooks/purity`) doesn't trip on direct calls inside the component body.
 */

export function sinceMsAgo(ms: number): Date {
  return new Date(Date.now() - ms);
}

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
