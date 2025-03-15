import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq, getTableColumns } from "drizzle-orm";

import { db } from "../index";
import { OrganizationDomainTable } from "./organization.sql";

export namespace OrganizationDomain {
  export type Model = InferSelectModel<typeof OrganizationDomainTable>;
  export type CreateInput = InferInsertModel<typeof OrganizationDomainTable>;
  export type UpdateInput = Partial<
    Omit<CreateInput, "organizationId" | "domain">
  > & {
    organizationId: Model["organizationId"];
  };

  export const columns = getTableColumns(OrganizationDomainTable);

  export async function create(values: CreateInput) {
    return (
      await db.insert(OrganizationDomainTable).values(values).returning()
    )[0];
  }

  export async function update({ organizationId, ...values }: UpdateInput) {
    return (
      await db
        .update(OrganizationDomainTable)
        .set(values)
        .where(eq(OrganizationDomainTable.organizationId, organizationId))
        .returning()
    )[0];
  }

  export async function findUnique(organizationId: Model["organizationId"]) {
    return (
      await db
        .select(columns)
        .from(OrganizationDomainTable)
        .where(eq(OrganizationDomainTable.organizationId, organizationId))
    )[0];
  }

  export async function findOne(filters: { domain?: string }) {
    let query = db
      .select(columns)
      .from(OrganizationDomainTable)
      .limit(1)
      .$dynamic();

    if (filters.domain) {
      query = query.where(eq(OrganizationDomainTable.domain, filters.domain));
    }

    return (await query)[0];
  }

  export async function remove(id: string) {
    await db
      .delete(OrganizationDomainTable)
      .where(eq(OrganizationDomainTable.organizationId, id));
  }
}
