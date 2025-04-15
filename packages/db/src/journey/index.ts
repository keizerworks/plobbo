import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq, getTableColumns } from "drizzle-orm";

import { db } from "../index";
import { JourneyTable } from "./journey.sql";

export namespace Journey {
  export type Model = InferSelectModel<typeof JourneyTable>;
  export type CreateInput = InferInsertModel<typeof JourneyTable>;
  export type UpdateInput = Partial<CreateInput> & {
    id: Model["id"];
  };

  export const columns = getTableColumns(JourneyTable);

  export async function create(values: CreateInput) {
    return (await db.insert(JourneyTable).values(values).returning())[0];
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
    const [journey] = await db
      .select()
      .from(JourneyTable)
      .where(eq(JourneyTable.id, id))
      .limit(1);

    return journey;
  }

  export async function findAll(filters: {
    organizationId?: string;
  }): Promise<Model[]> {
    let query = db.select().from(JourneyTable).$dynamic();

    if (filters.organizationId) {
      query = query.where(
        eq(JourneyTable.organizaitonId, filters.organizationId),
      );
    }

    return query;
  }
}
