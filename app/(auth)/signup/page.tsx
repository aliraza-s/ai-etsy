import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Craftly account with email, username, and password.",
};

export default function SignUpPage() {
  return (
    <div className="border-border bg-card text-card-foreground relative w-full max-w-md overflow-hidden rounded-2xl border p-8 shadow-sm backdrop-blur">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight">
        <span className="text-gradient">Create your account</span>
      </h1>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
        Free forever plan, 15 credits a month. No card required.
      </p>
      <Suspense fallback={null}>
        <SignUpForm />
      </Suspense>
      <p className="text-muted-foreground mt-6 text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
      <p className="text-muted-foreground mt-3 text-xs">
        By signing up you agree to our{" "}
        <Link href="/terms" className="hover:text-foreground underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="hover:text-foreground underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
