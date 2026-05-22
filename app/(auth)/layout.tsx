import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Craftly";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative isolate flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-12">
      <div aria-hidden className="mesh-bg pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="spotlight pointer-events-none absolute inset-0 -z-10" />
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <span
          aria-hidden
          className="from-primary to-accent inline-block size-6 rounded-md bg-gradient-to-br"
        />
        {APP_NAME}
      </Link>
      {children}
    </div>
  );
}
