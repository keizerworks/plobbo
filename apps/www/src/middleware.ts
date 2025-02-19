import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // res.headers.set(
  //   "Access-Control-Allow-Origin",
  //   process.env.NODE_ENV === "production"
  //     ? "https://dash.plobbo.com"
  //     : "http://localhost:3001",
  // );
  // res.headers.set(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  // );
  // res.headers.set(
  //   "Access-Control-Allow-Headers",
  //   "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Authorization, Date, X-Api-Version",
  // );

  if (req.method === "OPTIONS")
    return new NextResponse(null, { status: 200, headers: res.headers });
  return res;
}

export const config = {
  matcher: "/api/:path*", // Apply middleware to all API routes
};
