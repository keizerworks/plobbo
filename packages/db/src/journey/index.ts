import { eq, InferSelectModel } from "drizzle-orm";

import { db } from "..";
import { JourneyTable } from "./journey.sql";

export namespace Journey {
  export type Model = InferSelectModel<typeof JourneyTable>;
  export type CreateInput = InferSelectModel<typeof JourneyTable>;
  export type UpdateInput = Partial<CreateInput> & {
    id: Model["id"];
  };

  export async function create(value: CreateInput) {
    return (await db.insert(JourneyTable).values(value).returning())[0];
  }

  export async function update({ id, ...input }: UpdateInput) {
    const [journey] = await db
      .update(JourneyTable)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(JourneyTable.id, id))
      .returning();
    return journey;
  }

  export async function findById(id: string): Promise<Model | undefined> {
    return (
      await db.select().from(JourneyTable).where(eq(JourneyTable.id, id))
    )[0];
  }

  export async function remove(id: string): Promise<void> {
    await db.delete(JourneyTable).where(eq(JourneyTable.id, id));
  }
}
