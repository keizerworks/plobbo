import type { validateSessionToken } from "auth/session";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "env";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("session")?.value ?? null;

  if (pathname.startsWith("/api/validate-session")) {
    if (env.NODE_ENV === "production")
      return new NextResponse("This route is only available in development", {
        status: 500,
      });
    else return NextResponse.next();
  }

  if (pathname.startsWith("/signup") || pathname.startsWith("/signin")) {
    if (token) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.rewrite(new URL("/signin", request.url));
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const session: Awaited<ReturnType<typeof validateSessionToken>> =
    await (env.NODE_ENV === "production"
      ? validateSession(token)
      : fetch(new URL("/api/validate-session", request.url))
          .then((res) => {
            if (!res.ok) return undefined;
            return res.json();
          })
          .catch(() => undefined));

  if (!session) {
    return NextResponse.redirect(new URL("/signup", request.url), {
      url: new URL("/signup", request.url).toString(),
    });
  }

  const response = NextResponse.next();
  response.cookies.set("session", token, {
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
