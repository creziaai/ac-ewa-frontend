import { NextResponse, type NextRequest } from "next/server";
import { SESSION_FLAG_COOKIE_NAME } from "@/lib/auth/cookies";

const AUTH_ONLY_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_FLAG_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") || isAppPath(pathname)) {
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (AUTH_ONLY_PATHS.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Every authenticated app route besides /dashboard itself.
function isAppPath(pathname: string) {
  return [
    "/websites",
    "/scans",
    "/reports",
    "/notifications",
    "/billing",
    "/settings",
    "/ai",
    "/admin",
    "/agency",
  ].some((prefix) => pathname.startsWith(prefix));
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/websites/:path*",
    "/scans/:path*",
    "/reports/:path*",
    "/notifications/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/ai/:path*",
    "/admin/:path*",
    "/agency/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};

