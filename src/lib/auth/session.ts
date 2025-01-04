import type { SessionInterface } from "@/db/schema/session";
import type { UserInterface } from "@/db/schema/user";
import {
  deleteSession,
  getSessionWithUser,
  insertSession,
  updateSession,
} from "@/db/actions/session";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { createId } from "@paralleldrive/cuid2";

export type SessionValidationResult =
  | { session: SessionInterface; user: UserInterface }
  | { session: null; user: null };

export function generateSessionToken(): string {
  return createId();
}

export function getSessionIdFromToken(token: string): string {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function createSession(
  token: string,
  userId: string,
): Promise<SessionInterface> {
  const sessionId = getSessionIdFromToken(token);
  const session = await insertSession({
    id: sessionId,
    userId,
  });
  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = getSessionIdFromToken(token);
  const { user, session } = await getSessionWithUser(sessionId);

  if (!user) {
    return { user, session };
  }

  if (Date.now() >= session.expiresAt.getTime()) {
    await deleteSession(sessionId);
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const values = { expiresAt: session.expiresAt };
    await updateSession(session.id, values);
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await deleteSession(sessionId);
}
