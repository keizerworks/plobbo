import type { MiddlewareConfig, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (req.method === "OPTIONS")
    return new NextResponse(null, { status: 200, headers: res.headers });

  const pathname = req.nextUrl.pathname;
  const host = req.nextUrl.host;

  if (
    process.env.NODE_ENV === "production" &&
    host &&
    host !== "plobbo.com" &&
    pathname !== "/"
  ) {
    try {
      return NextResponse.rewrite(`https://plobbo.com/${host}${pathname}`);
    } catch (e) {
      console.error(e);
    }
  }

  return res;
}

export const config: MiddlewareConfig = { matcher: ["/:path*"] };
