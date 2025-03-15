import type { MiddlewareConfig, NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { globalForCustomDomain } from "./config/globals";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (!globalForCustomDomain.getOrgSlugFromCustomDomain) {
  globalForCustomDomain.getOrgSlugFromCustomDomain = async (domain) => {
    return await fetch("api/custom-domain-dev-wrapper/" + domain)
      .then((res) => res.json() as unknown as { url: string })
      .then(({ url }) => url);
  };
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (req.method === "OPTIONS")
    return new NextResponse(null, { status: 200, headers: res.headers });

  const pathname = req.nextUrl.pathname;
  const host = req.nextUrl.host;

  if (
    pathname.startsWith("https://plobbo.com/api/custom-domain-dev-wrapper") &&
    process.env.NODE_ENV === "production"
  ) {
    return NextResponse.json("This route is only available in development", {
      status: 500,
    });
  }

  if (
    process.env.NODE_ENV === "production" &&
    host &&
    host !== "plobbo.com" &&
    pathname !== "/"
  ) {
    try {
      const orgSlug = await globalForCustomDomain.getOrgSlugFromCustomDomain(
        `domain:${host}`,
      );
      if (!orgSlug) notFound();
      return NextResponse.rewrite(`https://plobbo.com/${orgSlug}${pathname}`);
    } catch (e) {
      console.error(e);
    }
  }

  return res;
}

export const config: MiddlewareConfig = { matcher: ["/:path*"] };
