import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
    asc,
    desc,
    count as drizzleCount,
    eq,
    getTableColumns,
    sql,
} from "drizzle-orm";

import type { ListBlogSortFilterInterface } from "@plobbo/validator/blog/list";

import type { Drizzle } from "../drizzle";
import type { OrganizationMember } from "../organization/member";
import type { BlogMetadata } from "./metadata";

import { OrganizationMemberTable } from "../organization/organization.sql";
import { BlogMetadataTable, BlogTable } from "./blog.sql";

export namespace Blog {
    export type Model = InferSelectModel<typeof BlogTable>;
    export type CreateInput = InferInsertModel<typeof BlogTable>;
    export type UpdateInput = Partial<CreateInput> & {
        id: Model["id"];
    };

    export const columns = getTableColumns(BlogTable);

    export async function create(db: Drizzle, values: CreateInput) {
        return (await db.insert(BlogTable).values(values).returning())[0];
    }

    export async function update(db: Drizzle, { id, ...input }: UpdateInput) {
        const [blog] = await db
            .update(BlogTable)
            .set({ ...input, updatedAt: new Date() })
            .where(eq(BlogTable.id, id))
            .returning();
        return blog;
    }

    export async function findById(
        db: Drizzle,
        id: string,
    ): Promise<Model | undefined> {
        const [blog] = await db
            .select({
                ...columns,
                metadata: sql<string>`
										json_object(
												'ogUrl', ${BlogMetadataTable.ogUrl},
												'ogImage', ${BlogMetadataTable.ogImage},
												'ogTitle', ${BlogMetadataTable.ogTitle},
												'ogDescription', ${BlogMetadataTable.ogDescription},
												'keywords', ${BlogMetadataTable.keywords},
												'description', ${BlogMetadataTable.description},
												'blogId', ${BlogMetadataTable.blogId}
										)
								`.as("metadata"),
            })
            .from(BlogTable)
            .where(eq(BlogTable.id, id))
            .limit(1)
            .then((blogs) =>
                blogs.map((b) => ({
                    ...b,
                    metadata: JSON.parse(
                        b.metadata,
                    ) as unknown as BlogMetadata.Model,
                })),
            );
        return blog;
    }

    export async function findOne(
        db: Drizzle,
        props: { slug?: string },
    ): Promise<Model | undefined> {
        let query = db
            .select({ ...columns })
            .from(BlogTable)
            .$dynamic();

        if (props.slug) {
            query = query
                .innerJoin(
                    BlogMetadataTable,
                    eq(BlogTable.id, BlogMetadataTable.blogId),
                )
                .where(eq(BlogTable.slug, props.slug));
        }

        const [blog] = await query.limit(1);
        return blog;
    }

    export const findAll = async (
        db: Drizzle,
        { filter, sort }: ListBlogSortFilterInterface,
    ) => {
        let query = db
            .select({
                ...columns,
                author: sql<string>`
										json_object(
												'id', ${OrganizationMemberTable.id},
												'organizationId', ${OrganizationMemberTable.organizationId},
												'userId', ${OrganizationMemberTable.userId},
												'role', ${OrganizationMemberTable.role},
												'createdAt', ${OrganizationMemberTable.createdAt},
												'updatedAt', ${OrganizationMemberTable.updatedAt}
										)
								`.as("author"),
            })
            .from(BlogTable)
            .innerJoin(
                OrganizationMemberTable,
                eq(BlogTable.authorId, OrganizationMemberTable.id),
            )
            .$dynamic();

        if (filter?.status) {
            query = query.where(eq(BlogTable.status, filter.status));
        }

        if (filter?.userId) {
            query = query.where(
                eq(OrganizationMemberTable.userId, filter.userId),
            );
        }

        if (filter?.organizationId) {
            query = query.where(
                eq(BlogTable.organizationId, filter.organizationId),
            );
        }

        // if (filter?.search?.length) {
        //     query = query.where(
        //         or(
        //             like(BlogTable.title, filter.search),
        //             like(BlogTable.slug, filter.search),
        //         ),
        //     );
        // }

        if (sort?.title)
            query = query.orderBy(
                (sort.title === "asc" ? asc : desc)(BlogTable.title),
            );

        if (sort?.status)
            query = query.orderBy(
                (sort.status === "asc" ? asc : desc)(BlogTable.status),
            );

        if (sort?.slug)
            query = query.orderBy(
                (sort.slug === "asc" ? asc : desc)(BlogTable.slug),
            );

        if (sort?.createdAt) {
            query = query.orderBy(
                (sort.createdAt === "asc" ? asc : desc)(BlogTable.createdAt),
            );
        }

        if (sort?.updatedAt) {
            query = query.orderBy(
                (sort.updatedAt === "asc" ? asc : desc)(BlogTable.updatedAt),
            );
        }

        if (sort?.authorName) {
            query = query.orderBy(
                (sort.authorName === "asc" ? asc : desc)(
                    OrganizationMemberTable.displayName,
                ),
            );
        }

        return (await query).map((blog) => ({
            ...blog,
            author: JSON.parse(
                blog.author,
            ) as unknown as OrganizationMember.Model,
        }));
    };

    export const count = async (
        db: Drizzle,
        filters?: ListBlogSortFilterInterface["filter"],
    ) => {
        let query = db
            .select({ count: drizzleCount() })
            .from(BlogTable)
            .$dynamic();

        if (filters?.status) {
            query = query.where(eq(BlogTable.status, filters.status));
        }

        if (filters?.userId) {
            query = query
                .innerJoin(
                    OrganizationMemberTable,
                    eq(OrganizationMemberTable.id, BlogTable.authorId),
                )
                .where(eq(OrganizationMemberTable.userId, filters.userId));
        }

        if (filters?.organizationId) {
            query = query.where(
                eq(BlogTable.organizationId, filters.organizationId),
            );
        }

        // if (filters?.search?.length) {
        //     query = query.where(
        //         or(
        //             like(BlogTable.title, filters.search),
        //             like(BlogTable.slug, filters.search),
        //         ),
        //     );
        // }

        const res = (await query)[0];
        return res?.count ?? 0;
    };

    export async function remove(db: Drizzle, id: string): Promise<void> {
        await db.delete(BlogTable).where(eq(BlogTable.id, id));
    }
}
