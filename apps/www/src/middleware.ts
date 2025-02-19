import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (req.method === "OPTIONS")
    return new NextResponse(null, { status: 200, headers: res.headers });
  return res;
}

export const config = {
  matcher: "/api/:path*", // Apply middleware to all API routes
};
