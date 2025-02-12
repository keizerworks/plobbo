import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

import type { Drizzle } from "../drizzle";
import { UserTable } from "./user.sql";

export namespace User {
  export type Model = InferSelectModel<typeof UserTable>;
  export type Create = InferInsertModel<typeof UserTable>;
  export type Update = Partial<Model> & { id: Model["id"] };

  export const findByEmail = async (
    db: Drizzle,
    email: string,
  ): Promise<Model | undefined> => {
    return (
      await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.email, email))
        .limit(1)
    )[0];
  };

  export const findById = async (db: Drizzle, id: string) => {
    return (
      await db.select().from(UserTable).where(eq(UserTable.id, id)).limit(1)
    )[0];
  };

  export const create = async (db: Drizzle, data: Create) => {
    return (await db.insert(UserTable).values(data).returning())[0];
  };

  export const update = async (db: Drizzle, data: Update) => {
    const { id, ...values } = data;
    return await db
      .update(UserTable)
      .set(values)
      .where(eq(UserTable.id, id))
      .returning();
  };
}
