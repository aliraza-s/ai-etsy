import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;
  const session = req.auth;
  const isAuthed = !!session;
  const isAdmin = session?.user?.role === "ADMIN";

  const isAppRoute = pathname.startsWith("/app");
  const isAdminRoute = pathname.startsWith("/admin");

  if ((isAppRoute || isAdminRoute) && !isAuthed) {
    const signin = new URL("/signin", origin);
    signin.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signin);
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/app", origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match everything except Next internals, static files, and API auth routes
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
