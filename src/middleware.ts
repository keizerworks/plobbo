import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authToken = request.cookies.get("session")?.value ?? null;

  if (pathname.startsWith("/signup") || pathname.startsWith("/signin")) {
    if (authToken) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!authToken) {
    return NextResponse.rewrite(new URL("/signin", request.url));
  }

  const response = NextResponse.next();
  response.cookies.set("session", authToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/trpc (TRPC routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api/trpc|test|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
