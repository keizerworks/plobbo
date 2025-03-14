import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  count as drizzleCount,
  eq,
  getTableColumns,
  getTableName,
  sql,
} from "drizzle-orm";

import type { OrganizationSubscription } from "../subscription";

import { db } from "../index";
import { OrganizationSubscriptionTable } from "../subscription/subscription.sql";
import { OrganizationMemberTable, OrganizationTable } from "./organization.sql";

export namespace Organization {
  export type Model = InferSelectModel<typeof OrganizationTable>;
  export type CreateInput = InferInsertModel<typeof OrganizationTable>;
  export type UpdateInput = Partial<CreateInput> & { id: Model["id"] };

  export interface Filters {
    userId: string;
  }

  export const tableName = getTableName(OrganizationTable);
  export const columns = getTableColumns(OrganizationTable);

  export async function create(values: CreateInput) {
    return (await db.insert(OrganizationTable).values(values).returning())[0];
  }

  export async function update({ id, ...input }: UpdateInput) {
    const [organization] = await db
      .update(OrganizationTable)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(OrganizationTable.id, id))
      .returning();
    return organization;
  }

  export async function findById(id: string): Promise<Model | undefined> {
    const [organization] = await db
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.id, id))
      .limit(1);
    return organization;
  }

  export async function findBySlug(slug: string): Promise<Model | undefined> {
    const [organization] = await db
      .select()
      .from(OrganizationTable)
      .where(eq(OrganizationTable.slug, slug))
      .limit(1);
    return organization;
  }

  export async function findAll(filters: Filters) {
    let query = db
      .select({
        ...getTableColumns(OrganizationTable),
        subscription: sql<OrganizationSubscription.Model>`(
          SELECT to_json(obj)
          FROM (
            SELECT *
            FROM ${OrganizationSubscriptionTable}
            WHERE ${OrganizationSubscriptionTable.organizationId} = ${OrganizationTable.id}
          ) AS obj
        )`.as("member"),
      })
      .from(OrganizationTable)
      .innerJoin(
        OrganizationSubscriptionTable,
        eq(OrganizationSubscriptionTable.organizationId, OrganizationTable.id),
      )
      .$dynamic();

    if (filters.userId) {
      query = query
        .innerJoin(
          OrganizationMemberTable,
          eq(OrganizationMemberTable.organizationId, OrganizationTable.id),
        )
        .where(eq(OrganizationMemberTable.userId, filters.userId));
    }

    return query;
  }

  export const count = async (filters: Filters) => {
    let query = db
      .select({ count: drizzleCount() })
      .from(OrganizationTable)
      .$dynamic();

    if (filters.userId) {
      query = query
        .innerJoin(
          OrganizationMemberTable,
          eq(OrganizationMemberTable.organizationId, OrganizationTable.id),
        )
        .where(eq(OrganizationMemberTable.userId, filters.userId));
    }

    const res = (await query)[0];
    return res?.count ?? 0;
  };

  export async function remove(id: string): Promise<void> {
    await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id));
  }
}
