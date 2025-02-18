import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { count, eq, getTableColumns, getTableName } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { db } from "~/db";

import { OrganizationMemberTable, OrganizationTable } from "./organization.sql";

export namespace Organization {
    export type Model = InferSelectModel<typeof OrganizationTable>;
    export type CreateInput = InferInsertModel<typeof OrganizationTable>;
    export type UpdateInput = Partial<CreateInput>;

    export const tableName = getTableName(OrganizationTable);

    export const createSchema = createInsertSchema(OrganizationTable, {
        name: (schema) =>
            schema.min(2, {
                message: "Organization name must be at least 2 characters.",
            }),
        slug: (schema) =>
            schema.min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
                message:
                    "Slug must contain only lowercase letters, numbers, and hyphens.",
            }),
        logo: (s) => s.optional(),
    });

    export const updateSchema = createUpdateSchema(OrganizationTable, {
        name: (schema) =>
            schema.min(2, {
                message: "Organization name must be at least 2 characters.",
            }),
        slug: (schema) =>
            schema.min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
                message:
                    "Slug must contain only lowercase letters, numbers, and hyphens.",
            }),
    });

    export async function create(values: CreateInput) {
        return (
            await db.insert(OrganizationTable).values(values).returning()
        )[0];
    }

    export async function update(
        id: string,
        input: UpdateInput,
    ): Promise<Model> {
        const [organization] = await db
            .update(OrganizationTable)
            .set({ ...input, updatedAt: new Date() })
            .where(eq(OrganizationTable.id, id))
            .returning();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return organization!; // INFO: organization will be defined
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

    export async function findAllByUserId(userId: string): Promise<Model[]> {
        return await db
            .select({ ...getTableColumns(OrganizationTable) })
            .from(OrganizationTable)
            .innerJoin(
                OrganizationMemberTable,
                eq(
                    OrganizationMemberTable.organizationId,
                    OrganizationTable.id,
                ),
            )
            .where(eq(OrganizationMemberTable.userId, userId));
    }

    export async function countByUserId(
        userId: string,
    ): Promise<number | undefined> {
        const [res] = await db
            .select({ count: count() })
            .from(OrganizationTable)
            .innerJoin(
                OrganizationMemberTable,
                eq(
                    OrganizationMemberTable.organizationId,
                    OrganizationTable.id,
                ),
            )
            .where(eq(OrganizationMemberTable.userId, userId));

        return res?.count;
    }

    export async function remove(id: string): Promise<void> {
        await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id));
    }
}
