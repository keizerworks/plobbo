import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { db, eq } from "../index";
import { WaitlistTable } from "./user.sql";

export namespace Waitlist {
  export type Model = InferSelectModel<typeof WaitlistTable>;
  export type Create = InferInsertModel<typeof WaitlistTable>;
  export type Update = Omit<Model, "id" | "email"> & { id: string };

  export async function create(values: Create) {
    return (await db.insert(WaitlistTable).values(values).returning())[0];
  }

  export async function update({ id, ...values }: Update) {
    return (
      await db
        .update(WaitlistTable)
        .set(values)
        .returning()
        .where(eq(WaitlistTable.id, id))
    )[0];
  }

  export async function findOne({ email }: { email: string }) {
    return (
      await db
        .select()
        .from(WaitlistTable)
        .where(eq(WaitlistTable.email, email))
        .limit(1)
    )[0];
  }
}
