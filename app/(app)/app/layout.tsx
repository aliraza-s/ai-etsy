import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <div className="bg-background min-h-[calc(100vh-3.5rem)]">
      <div className="border-border/60 bg-background/80 sticky top-14 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <nav aria-label="App" className="flex items-center gap-4 text-sm">
            <Link href="/app" className="text-foreground font-medium">
              Dashboard
            </Link>
            <Link href="/app/history" className="text-muted-foreground hover:text-foreground">
              History
            </Link>
            <Link href="/app/billing" className="text-muted-foreground hover:text-foreground">
              Billing
            </Link>
            {session.user.role === "ADMIN" && (
              <Link href="/admin" className="text-accent-foreground hover:text-accent">
                Admin
              </Link>
            )}
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
