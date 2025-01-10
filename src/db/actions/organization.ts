import type { CreateOrganizationInterface } from "db/schema/organization";
import { db } from "db";
import {
  OrganizationMemberTable,
  OrganizationTable,
} from "db/schema/organization";
import { eq } from "drizzle-orm";

export const getOrganizationBySlug = async (slug: string) => {
  const orgs = await db
    .select()
    .from(OrganizationTable)
    .where(eq(OrganizationTable.slug, slug))
    .limit(1);
  return orgs[0];
};

export const createOrganization = async (
  values: CreateOrganizationInterface,
) => {
  const orgs = await db.insert(OrganizationTable).values(values).returning();
  if (!orgs[0]) throw new Error();
  return orgs[0];
};

export const updateOrganization = async (
  id: string,
  values: Partial<CreateOrganizationInterface>,
) => {
  await db
    .update(OrganizationTable)
    .set(values)
    .where(eq(OrganizationTable.id, id))
    .execute();
};

export const deleteOrganization = async (id: string) => {
  await db
    .delete(OrganizationTable)
    .where(eq(OrganizationTable.id, id))
    .execute();
};

export const getOrganizationsByUserId = async (userId: string) => {
  return await db
    .select({
      organization: OrganizationTable,
      member: OrganizationMemberTable,
    })
    .from(OrganizationMemberTable)
    .innerJoin(
      OrganizationTable,
      eq(OrganizationMemberTable.organizationId, OrganizationTable.id),
    )
    .where(eq(OrganizationMemberTable.userId, userId));
};
