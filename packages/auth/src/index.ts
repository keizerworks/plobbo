import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { eq } from "drizzle-orm/sql";

import { db } from "@plobbo/db/index";
import { Session } from "@plobbo/db/user/session";
import { SessionTable, UserTable } from "@plobbo/db/user/user.sql";

export namespace Auth {
  export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  }

  export async function createSession(token: string, userId: string) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    const session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    } satisfies Session.Model;
    await Session.create(session);

    return session;
  }

  export async function validateSessionToken(token: string) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    const result = (
      await db
        .select({ user: UserTable, session: SessionTable })
        .from(SessionTable)
        .innerJoin(UserTable, eq(SessionTable.userId, UserTable.id))
        .limit(1)
        .where(eq(SessionTable.id, sessionId))
    )[0];

    if (!result) return { session: null, user: null };
    const { user, session } = result;

    if (Date.now() >= session.expiresAt.getTime()) {
      await Session.remove(session.id);
      return { session: null, user: null };
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await Session.update(session.id, { expiresAt: session.expiresAt });
    }

    return { session, user };
  }

  export async function invalidateSession(sessionId: string): Promise<void> {
    await Session.remove(sessionId);
  }

  export async function invalidateAllSessions(userId: string): Promise<void> {
    await db.delete(SessionTable).where(eq(SessionTable.userId, userId));
  }
}
