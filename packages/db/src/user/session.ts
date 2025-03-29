import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

import { db } from "../index";
import { SessionTable } from "./user.sql";

export namespace Session {
  export type Model = InferSelectModel<typeof SessionTable>;
  export type Create = InferInsertModel<typeof SessionTable>;
  export type Update = Partial<Omit<Model, "id">>;

  export const findById = async (id: string) => {
    return (
      await db
        .select()
        .from(SessionTable)
        .where(eq(SessionTable.id, id))
        .limit(1)
    )[0];
  };

  export const create = async (data: Create) => {
    return await db.insert(SessionTable).values(data);
  };

  export const update = async (id: Model["id"], data: Update) => {
    return await db
      .update(SessionTable)
      .set(data)
      .where(eq(SessionTable.id, id));
  };

  export const remove = async (id: Model["id"]) => {
    return await db.delete(SessionTable).where(eq(SessionTable.id, id));
  };
}
