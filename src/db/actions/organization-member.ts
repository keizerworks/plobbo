import type { CreateOrganizationMemberInterface } from "db/schema/organization";
import { db } from "db";
import { OrganizationMemberTable } from "db/schema/organization";
import { eq } from "drizzle-orm";

export const createOrganizationMember = async (
  values: CreateOrganizationMemberInterface,
) => {
  const members = await db
    .insert(OrganizationMemberTable)
    .values(values)
    .returning();
  if (!members[0]) throw new Error();
  return members[0];
};

export const getOrganizationMembers = async (organizationId: string) => {
  return await db
    .select()
    .from(OrganizationMemberTable)
    .where(eq(OrganizationMemberTable.organizationId, organizationId));
};

export const updateOrganizationMember = async (
  id: string,
  values: Partial<CreateOrganizationMemberInterface>,
) => {
  await db
    .update(OrganizationMemberTable)
    .set(values)
    .where(eq(OrganizationMemberTable.id, id))
    .execute();
};

export const deleteOrganizationMember = async (id: string) => {
  await db
    .delete(OrganizationMemberTable)
    .where(eq(OrganizationMemberTable.id, id))
    .execute();
};
