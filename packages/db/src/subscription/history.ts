import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { db, eq, getTableColumns } from "../index";
import { OrganizationSubscriptionHistoryTable } from "./subscription.sql";

export namespace SubscriptionHistory {
  export type Model = InferSelectModel<
    typeof OrganizationSubscriptionHistoryTable
  >;

  export type CreateInput = InferInsertModel<
    typeof OrganizationSubscriptionHistoryTable
  >;

  export type UpdateInput = Partial<Omit<CreateInput, "id">> & {
    id: Model["id"];
  };

  export const columns = getTableColumns(OrganizationSubscriptionHistoryTable);

  export async function create(payload: CreateInput) {
    return (
      await db
        .insert(OrganizationSubscriptionHistoryTable)
        .values(payload)
        .returning()
    )[0];
  }

  export async function findByOrganization(organizationId: string) {
    return await db
      .select(columns)
      .from(OrganizationSubscriptionHistoryTable)
      .where(
        eq(OrganizationSubscriptionHistoryTable.organizationId, organizationId),
      )
      .orderBy(OrganizationSubscriptionHistoryTable.startDate);
  }

  export async function findUnique(id: string) {
    return (
      await db
        .select()
        .from(OrganizationSubscriptionHistoryTable)
        .where(eq(OrganizationSubscriptionHistoryTable.id, id))
        .limit(1)
    )[0];
  }
}
