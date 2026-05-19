import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Check your email",
  description: "We sent you a magic link.",
};

export default function VerifyEmailPage() {
  return (
    <div className="border-border bg-card text-card-foreground w-full max-w-md rounded-xl border p-8 text-center shadow-sm">
      <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
        <Mail className="size-5" aria-hidden />
      </div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Check your email</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        We sent a magic link to your inbox. Click it to finish signing in. The link expires in 24
        hours.
      </p>
      <p className="text-muted-foreground mt-4 text-xs">
        Didn&apos;t get it? Check your spam folder, or{" "}
        <Link href="/signin" className="hover:text-foreground underline underline-offset-2">
          try again
        </Link>
        .
      </p>
    </div>
  );
}
