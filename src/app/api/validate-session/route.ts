import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateSessionToken } from "auth/session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("session")?.value ?? null;
  if (!token) return NextResponse.json({});
  const session = await validateSessionToken(token);
  return NextResponse.json(session);
}
