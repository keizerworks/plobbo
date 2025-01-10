import { eq } from "drizzle-orm";

import type { InsertSessionInterface } from "../schema/session";
import { db } from "..";
import { SessionTable } from "../schema/session";
import { UserTable } from "../schema/user";

export const insertSession = async (values: InsertSessionInterface) => {
  const sessions = await db.insert(SessionTable).values(values).returning();
  if (!sessions[0]) throw new Error();
  return sessions[0];
};

export const getSessionWithUser = async (sessionId: string) => {
  const res = await db
    .select({ user: UserTable, session: SessionTable })
    .from(SessionTable)
    .innerJoin(UserTable, eq(SessionTable.userId, UserTable.id))
    .where(eq(SessionTable.id, sessionId))
    .limit(1);
  return res[0];
};

export const updateSession = async (
  values: Partial<InsertSessionInterface>,
  id: string,
) => {
  await db.update(SessionTable).set(values).where(eq(SessionTable.id, id));
};

export const deleteSession = async (id: string) =>
  await db.delete(SessionTable).where(eq(SessionTable.id, id));
