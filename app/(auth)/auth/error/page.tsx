import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign-in error",
  description: "Something went wrong while signing in.",
};

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Auth is misconfigured. Try again in a moment.",
  AccessDenied: "Access denied. You don't have permission to sign in.",
  Verification: "That magic link is no longer valid. Request a new one.",
  Default: "Something went wrong. Please try again.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = ERROR_MESSAGES[error ?? ""] ?? ERROR_MESSAGES.Default;

  return (
    <div className="border-border bg-card text-card-foreground w-full max-w-md rounded-xl border p-8 text-center shadow-sm">
      <div className="bg-destructive/10 text-destructive mx-auto flex size-12 items-center justify-center rounded-full">
        <AlertTriangle className="size-5" aria-hidden />
      </div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Sign-in error</h1>
      <p className="text-muted-foreground mt-2 text-sm">{message}</p>
      <Link
        href="/signin"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors"
      >
        Back to sign in
      </Link>
    </div>
  );
}
