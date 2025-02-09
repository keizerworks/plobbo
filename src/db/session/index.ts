import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { db } from "db";
import { User } from "db/user";
import { eq, getTableColumns, getTableName, sql } from "drizzle-orm";

import { SessionTable } from "./session.sql";

export namespace Session {
  export type Model = InferSelectModel<typeof SessionTable>;
  export type CreateInput = InferInsertModel<typeof SessionTable>;
  export type UpdateInput = Partial<CreateInput>;

  export const tableName = getTableName(SessionTable);

  export async function create(values: CreateInput) {
    return (await db.insert(SessionTable).values(values).returning())[0];
  }

  export async function update(id: string, input: UpdateInput): Promise<Model> {
    const [session] = await db
      .update(SessionTable)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(SessionTable.id, id))
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return session!; // INFO: session will be defined
  }

  export async function findById(id: string) {
    const [session] = await db
      .select({
        ...getTableColumns(SessionTable),
        user: sql<User.Model>`(
					SELECT to_json(obj)
					FROM (
						SELECT *
						FROM "${User.tableName}"
						WHERE "${User.tableName}"."id" = "${tableName}"."user_id"
					) AS obj
				)`,
      })
      .from(SessionTable)
      .where(eq(SessionTable.id, id))
      .limit(1);
    return session;
  }

  export async function findByUserId(
    userId: string,
  ): Promise<Model | undefined> {
    const [session] = await db
      .select()
      .from(SessionTable)
      .where(eq(SessionTable.userId, userId))
      .limit(1);
    return session;
  }

  export async function remove(id: string): Promise<void> {
    await db.delete(SessionTable).where(eq(SessionTable.id, id));
  }

  export async function removeUserSessions(userId: string): Promise<void> {
    await db.delete(SessionTable).where(eq(SessionTable.userId, userId));
  }
}
