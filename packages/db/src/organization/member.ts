import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq, getTableColumns, getTableName } from "drizzle-orm";

import { db } from "../index";
import { OrganizationMemberTable } from "./organization.sql";

export namespace OrganizationMember {
  export type Model = InferSelectModel<typeof OrganizationMemberTable>;
  export type CreateInput = InferInsertModel<typeof OrganizationMemberTable>;
  export type UpdateInput = Partial<CreateInput> & { id: Model["id"] };

  export const tableName = getTableName(OrganizationMemberTable);

  export async function create(values: CreateInput) {
    return (
      await db.insert(OrganizationMemberTable).values(values).returning()
    )[0];
  }

  export async function update({ id, ...input }: UpdateInput): Promise<Model> {
    const [organizationMember] = await db
      .update(OrganizationMemberTable)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(OrganizationMemberTable.id, id))
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return organizationMember!; // INFO: organizationMember will be defined
  }

  export const findAll = async (props: {
    organizationId?: string;
    userId?: string;
  }) => {
    const query = db
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

    return await query;
  };

  export async function findById(id: string): Promise<Model | undefined> {
    const [organizationMember] = await db
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
    const query = db
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

  export async function remove(filters: {
    id: string;
    organizationId: string;
  }) {
    if (Object.values(filters).every((value) => !value)) {
      throw new Error("At least one filter must be provided");
    }

    let query = db.delete(OrganizationMemberTable).$dynamic();

    if (filters.id) {
      query = query.where(eq(OrganizationMemberTable.id, filters.id));
    }

    if (filters.organizationId) {
      query = query.where(
        eq(OrganizationMemberTable.organizationId, filters.organizationId),
      );
    }

    await query;
  }
}
