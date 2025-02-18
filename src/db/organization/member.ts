import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq, getTableColumns, getTableName } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { db } from "~/db";
import { OrganizationMemberTable } from "~/db/organization/organization.sql";

export namespace OrganizationMember {
    export type Model = InferSelectModel<typeof OrganizationMemberTable>;
    export type CreateInput = InferInsertModel<typeof OrganizationMemberTable>;
    export type UpdateInput = Partial<CreateInput> & { id: Model["id"] };

    export const tableName = getTableName(OrganizationMemberTable);

    export const createSchema = createInsertSchema(OrganizationMemberTable, {
        displayName: (s) => s.min(2),
        bio: (s) => s.min(2).optional(),
    });

    export const updateSchema = createUpdateSchema(OrganizationMemberTable, {
        displayName: (s) => s.min(2),
        bio: (s) => s.min(2).optional(),
    });

    export async function create(values: CreateInput) {
        return (
            await db.insert(OrganizationMemberTable).values(values).returning()
        )[0];
    }

    export async function update({
        id,
        ...input
    }: UpdateInput): Promise<Model> {
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
                eq(
                    OrganizationMemberTable.organizationId,
                    props.organizationId,
                ),
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
                eq(
                    OrganizationMemberTable.organizationId,
                    props.organizationId,
                ),
            );
        }

        if (props.userId) {
            query.where(eq(OrganizationMemberTable.userId, props.userId));
        }

        const [organizationMember] = await query.limit(1);
        return organizationMember;
    }

    export async function remove(id: string): Promise<void> {
        await db
            .delete(OrganizationMemberTable)
            .where(eq(OrganizationMemberTable.id, id));
    }

    export async function removeByOrganizationId(
        organizationId: string,
    ): Promise<void> {
        await db
            .delete(OrganizationMemberTable)
            .where(eq(OrganizationMemberTable.organizationId, organizationId));
    }
}
