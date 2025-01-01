import type { InsertSessionInterface } from "db/schema/session";
import type { SessionValidationResult } from "utils/auth/session";
import { db } from "db";
import { SessionTable } from "db/schema/session";
import { UserTable } from "db/schema/user";
import { eq } from "drizzle-orm";

export async function insertSession(values: InsertSessionInterface) {
  const sessions = await db.insert(SessionTable).values(values).returning();
  return sessions[0];
}

export async function updateSession(
  sessionId: string,
  values: Partial<InsertSessionInterface>,
) {
  const sessions = await db
    .update(SessionTable)
    .set(values)
    .where(eq(SessionTable.id, sessionId))
    .returning();
  return sessions[0];
}

export async function getSessionWithUser(
  sessionId: string,
): Promise<SessionValidationResult> {
  const result = await db
    .select({ user: UserTable, session: SessionTable })
    .from(SessionTable)
    .innerJoin(UserTable, eq(SessionTable.userId, UserTable.id))
    .where(eq(SessionTable.id, sessionId))
    .limit(1);

  if (result.length < 1) {
    return { session: null, user: null };
  }
  return result[0];
}

export async function deleteSession(sessionId: string): Promise<void> {
  await db.delete(SessionTable).where(eq(SessionTable.id, sessionId));
}
