import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  and,
  asc,
  desc,
  count as drizzleCount,
  eq,
  getTableColumns,
  ilike,
  or,
  sql,
} from "drizzle-orm";

import type { ListBlogSortFilterInterface } from "@plobbo/validator/blog/list";

import type { OrganizationMember } from "../organization/member";
import type { BlogMetadata } from "./metadata";

import { db } from "../index";
import { OrganizationMemberTable } from "../organization/organization.sql";
import { BlogMetadataTable, BlogTable } from "./blog.sql";

export namespace Blog {
  export type Model = InferSelectModel<typeof BlogTable>;
  export type CreateInput = InferInsertModel<typeof BlogTable>;
  export type UpdateInput = Partial<CreateInput> & {
    id: Model["id"];
  };

  export const columns = getTableColumns(BlogTable);

  export async function create(values: CreateInput) {
    return (await db.insert(BlogTable).values(values).returning())[0];
  }

  export async function update({ id, ...input }: UpdateInput) {
    const [blog] = await db
      .update(BlogTable)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(BlogTable.id, id))
      .returning();
    return blog;
  }

  export async function findById(id: string): Promise<Model | undefined> {
    const [blog] = await db
      .select({
        ...columns,
        metadata: sql<BlogMetadata.Model>`(
					SELECT to_json(obj)
					FROM (
						SELECT *
						FROM ${BlogMetadataTable}
						WHERE ${BlogMetadataTable.blogId} = ${BlogTable.id}
					) AS obj
				)`.as("metadata"),
      })
      .from(BlogTable)
      .where(eq(BlogTable.id, id))
      .limit(1);

    return blog;
  }

  export async function findOne(props: {
    slug?: string;
  }): Promise<Model | undefined> {
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

  export const findAll = async ({
    filter,
    sort,
  }: ListBlogSortFilterInterface) => {
    let query = db
      .select({
        ...columns,
        author: sql<OrganizationMember.Model>`(
          SELECT to_json(obj)
          FROM (
            SELECT *
            FROM ${OrganizationMemberTable}
            WHERE ${OrganizationMemberTable.id} = ${BlogTable.authorId}
          ) AS obj
        )`.as("author"),
      })
      .from(BlogTable)
      .innerJoin(
        OrganizationMemberTable,
        eq(BlogTable.authorId, OrganizationMemberTable.id),
      )
      .$dynamic();
  
    const conditions = [];
  
    if (filter?.status) {
      conditions.push(eq(BlogTable.status, filter.status));
    }
  
    if (filter?.journeyId) {
      conditions.push(eq(BlogTable.journeyId, filter.journeyId));
    }
  
    if (filter?.userId) {
      conditions.push(eq(OrganizationMemberTable.userId, filter.userId));
    }
  
    if (filter?.organizationId) {
      conditions.push(eq(BlogTable.organizationId, filter.organizationId));
    }
  
    if (filter?.search?.length) {
      conditions.push(
        or(
          ilike(BlogTable.title, filter.search),
          ilike(BlogTable.slug, filter.search),
        ),
      );
    }
  
    if (conditions.length) {
      query = query.where(and(...conditions));
    }
  
    // Sorting (keep this part as-is)
    if (sort?.title) {
      query = query.orderBy(
        (sort.title === "asc" ? asc : desc)(BlogTable.title),
      );
    }
    if (sort?.status) {
      query = query.orderBy(
        (sort.status === "asc" ? asc : desc)(BlogTable.status),
      );
    }
    if (sort?.slug) {
      query = query.orderBy((sort.slug === "asc" ? asc : desc)(BlogTable.slug));
    }
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
  
    return await query;
  };
}
