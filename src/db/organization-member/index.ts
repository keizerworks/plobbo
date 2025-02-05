import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { drizzleDb } from "db";
import { OrganizationMemberTable } from "db/organization/organization.sql";
import { eq, getTableColumns, getTableName } from "drizzle-orm";

export namespace OrganizationMember {
  export type Model = InferSelectModel<typeof OrganizationMemberTable>;
  export type CreateInput = InferInsertModel<typeof OrganizationMemberTable>;
  export type UpdateInput = Partial<CreateInput>;

  export const tableName = getTableName(OrganizationMemberTable);

  export async function create(values: CreateInput) {
    return (
      await drizzleDb.insert(OrganizationMemberTable).values(values).returning()
    )[0];
  }

  export async function update(id: string, input: UpdateInput): Promise<Model> {
    const [organizationMember] = await drizzleDb
      .update(OrganizationMemberTable)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(OrganizationMemberTable.id, id))
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return organizationMember!; // INFO: organizationMember will be defined
  }

  export async function findById(id: string): Promise<Model | undefined> {
    const [organizationMember] = await drizzleDb
      .select()
      .from(OrganizationMemberTable)
      .where(eq(OrganizationMemberTable.id, id))
      .limit(1);
    return organizationMember;
  }

  export async function findOne(props: {
    organizationId?: string;
    userId?: string;
  }) {
    const query = drizzleDb
      .select({ ...getTableColumns(OrganizationMemberTable) })
      .from(OrganizationMemberTable)
      .$dynamic();

    if (props.organizationId) {
      query.where(
        eq(OrganizationMemberTable.organizationId, props.organizationId),
      );
    }

    if (props.userId) {
      query.where(eq(OrganizationMemberTable.userId, props.userId));
    }

    const [organizationMember] = await query.limit(1);
    return organizationMember;
  }

  export async function remove(id: string): Promise<void> {
    await drizzleDb
      .delete(OrganizationMemberTable)
      .where(eq(OrganizationMemberTable.id, id));
  }

  export async function removeByOrganizationId(
    organizationId: string,
  ): Promise<void> {
    await drizzleDb
      .delete(OrganizationMemberTable)
      .where(eq(OrganizationMemberTable.organizationId, organizationId));
  }
}
