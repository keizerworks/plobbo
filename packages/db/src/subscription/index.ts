import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq, getTableColumns } from "drizzle-orm";

import { db } from "../index";
import { OrganizationSubscriptionTable } from "./subscription.sql";

export namespace OrganizationSubscription {
  export type Model = InferSelectModel<typeof OrganizationSubscriptionTable>;

  export type CreateInput = InferInsertModel<
    typeof OrganizationSubscriptionTable
  >;

  export type UpdateInput = Partial<Omit<CreateInput, "id">> & {
    id: Model["id"];
  };

  export const columns = getTableColumns(OrganizationSubscriptionTable);

  export async function create(payload: CreateInput) {
    return (
      await db.insert(OrganizationSubscriptionTable).values(payload).returning()
    )[0];
  }

  export async function findOne(filter: { organizationId?: string }) {
    let query = db
      .select(columns)
      .from(OrganizationSubscriptionTable)
      .limit(1)
      .$dynamic();

    if (filter.organizationId) {
      query = query.where(
        eq(OrganizationSubscriptionTable.organizationId, filter.organizationId),
      );
    }

    const [sub] = await query;
    return sub;
  }

  export async function findUnique(id: string) {
    return (
      await db
        .select()
        .from(OrganizationSubscriptionTable)
        .where(eq(OrganizationSubscriptionTable.id, id))
    )[0];
  }

  export async function update({ id, ...payload }: UpdateInput) {
    return (
      await db
        .update(OrganizationSubscriptionTable)
        .set(payload)
        .returning()
        .where(eq(OrganizationSubscriptionTable.id, id))
    )[0];
  }

  export async function remove(id: string) {
    return (
      await db
        .delete(OrganizationSubscriptionTable)
        .returning()
        .where(eq(OrganizationSubscriptionTable.id, id))
    )[0];
  }
}
