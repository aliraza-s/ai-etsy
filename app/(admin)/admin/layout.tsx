import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";

export const metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (session.user.role !== "ADMIN") redirect("/app");

  return (
    <div className="bg-background min-h-[calc(100vh-3.5rem)]">
      <div className="border-border/60 bg-background/80 sticky top-14 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Admin"
            className="-mx-2 flex items-center gap-x-1 overflow-x-auto px-2 text-sm whitespace-nowrap"
          >
            <span className="text-primary mr-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-wider uppercase">
              <ShieldCheck className="size-3.5" aria-hidden /> Admin
            </span>
            <AdminTab href="/admin" label="Overview" />
            <AdminTab href="/admin/users" label="Users" />
            <AdminTab href="/admin/usage" label="Usage" />
            <AdminTab href="/admin/ai-config" label="AI config" />
            <AdminTab href="/admin/api-keys" label="API keys" />
            <AdminTab href="/admin/announcements" label="Announcements" />
            <Link
              href="/app"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary ml-2 rounded px-2 py-1 transition-colors"
            >
              ← Back to app
            </Link>
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
            >
              <LogOut className="size-3.5" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}

function AdminTab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded px-2 py-1 transition-colors"
    >
      {label}
    </Link>
  );
}
