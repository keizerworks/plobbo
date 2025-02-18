import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { and, eq, getTableColumns, getTableName } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { db } from "~/db";

import { BlogMetadataTable } from "./blog.sql";

export namespace BlogMetadata {
    export type Model = InferSelectModel<typeof BlogMetadataTable>;
    export type CreateInput = InferInsertModel<typeof BlogMetadataTable>;
    export type UpdateInput =
        | (Partial<Omit<CreateInput, "id" | "blogId">> & {
              blogId: Model["blogId"];
          })
        | (Partial<Omit<CreateInput, "id" | "blogId">> & { id: Model["id"] });

    export const tableName = getTableName(BlogMetadataTable);
    export const columns = getTableColumns(BlogMetadataTable);

    export const createSchema = createInsertSchema(BlogMetadataTable, {
        title: (s) =>
            s.min(2, {
                message: "Title must be at least 2 characters.",
            }),
    });

    export const updateSchema = createUpdateSchema(BlogMetadataTable, {
        title: (s) =>
            s.min(2, {
                message: "Title must be at least 2 characters.",
            }),
    });

    export async function create(values: CreateInput) {
        return (
            await db.insert(BlogMetadataTable).values(values).returning()
        )[0];
    }

    export async function update(props: UpdateInput) {
        const { ...input } = props;
        return (
            await db
                .update(BlogMetadataTable)
                .set({ ...input, updatedAt: new Date() })
                .where(
                    and(
                        "id" in props
                            ? eq(BlogMetadataTable.id, props.id)
                            : eq(BlogMetadataTable.blogId, props.blogId),
                    ),
                )
                .returning()
        )[0];
    }

    export async function findOne(
        props: { id: Model["id"] } | { blogId: Model["blogId"] },
    ) {
        return (
            await db
                .select()
                .from(BlogMetadataTable)
                .where(
                    "id" in props
                        ? eq(BlogMetadataTable.id, props.id)
                        : eq(BlogMetadataTable.blogId, props.blogId),
                )
                .limit(1)
        )[0];
    }

    export async function remove(id: string): Promise<void> {
        await db.delete(BlogMetadataTable).where(eq(BlogMetadataTable.id, id));
    }
}
