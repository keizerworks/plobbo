import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getOrgSlugFromCustomDomain } from "~/actions/custom-domain";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ domain: string }> },
) {
  const { domain } = await params;
  const orgSlug = await getOrgSlugFromCustomDomain(domain);
  return NextResponse.json({ orgSlug });
}
