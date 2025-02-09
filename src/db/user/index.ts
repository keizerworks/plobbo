import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { db } from "db";
import { eq, getTableName } from "drizzle-orm";

import { UserTable } from "./user.sql";

export namespace User {
  export type Model = InferSelectModel<typeof UserTable>;
  export type CreateInput = InferInsertModel<typeof UserTable>;
  export type UpdateInput = Partial<CreateInput>;

  export const tableName = getTableName(UserTable);

  export async function create(values: CreateInput) {
    return (await db.insert(UserTable).values(values).returning())[0];
  }

  export async function update(id: string, input: UpdateInput): Promise<Model> {
    const [user] = await db
      .update(UserTable)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(UserTable.id, id))
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return user!; // INFO: user will be defined
  }

  export async function findById(id: string): Promise<Model | undefined> {
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.id, id))
      .limit(1);
    return user;
  }

  export async function findByEmail(email: string): Promise<Model | undefined> {
    const [user] = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.email, email))
      .limit(1);
    return user;
  }

  export async function remove(id: string): Promise<void> {
    await db.delete(UserTable).where(eq(UserTable.id, id));
  }
}
