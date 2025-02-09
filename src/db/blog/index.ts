import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { ListBlogSortFilterInterface } from "validators/blog/list";
import { db } from "db";
import { Organization } from "db/organization";
import { OrganizationMember } from "db/organization/member";
import {
  count as drizzleCount,
  eq,
  getTableColumns,
  getTableName,
  ilike,
  or,
  sql,
} from "drizzle-orm";

import { BlogMetadataTable, BlogTable } from "./blog.sql";
import { BlogMetadata } from "./metadata";

export namespace Blog {
  export type Model = InferSelectModel<typeof BlogTable>;
  export type CreateInput = InferInsertModel<typeof BlogTable>;
  export type UpdateInput = Partial<CreateInput> & { id: Model["id"] };

  export const tableName = getTableName(BlogTable);
  export const columns = getTableColumns(BlogTable);

  export async function create(values: CreateInput) {
    return (await db.insert(BlogTable).values(values).returning())[0];
  }

  export async function update(input: UpdateInput): Promise<Model> {
    const [blog] = await db
      .update(BlogTable)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(BlogTable.id, input.id))
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return blog!; // INFO: blog will be defined
  }

  export async function findById(id: string): Promise<Model | undefined> {
    const [blog] = await db
      .select()
      .from(BlogTable)
      .where(eq(BlogTable.id, id))
      .limit(1);
    return blog;
  }

  export async function findOne(props: {
    slug: string;
  }): Promise<Model | undefined> {
    let query = db
      .select({ ...columns })
      .from(BlogTable)
      .$dynamic();

    if (props.slug) {
      query = query.where(eq(BlogTable.slug, props.slug));
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
        metadata: sql<BlogMetadata.Model>`(
					SELECT to_json(obj)
					FROM (
						SELECT *
						FROM "${BlogMetadata.tableName}"
						WHERE "${BlogMetadata.tableName}"."blog_id" = "${tableName}"."id"
					) AS obj
				)`,
        organization: sql<Organization.Model>`(
					SELECT to_json(obj)
					FROM (
						SELECT *
						FROM "${Organization.tableName}"
						WHERE "${Organization.tableName}"."id" = "${tableName}"."organization_id"
					) AS obj
				)`,
        author: sql<OrganizationMember.Model>`(
					SELECT to_json(obj)
					FROM (
						SELECT *
						FROM "${OrganizationMember.tableName}"
						WHERE "${OrganizationMember.tableName}"."id" = "${tableName}"."author_id"
					) AS obj
				)`,
      })
      .from(BlogTable)
      .$dynamic();

    if (filter?.status) {
      query = query.where(eq(BlogTable.status, filter.status));
    }

    if (filter?.user_id) {
      query = query.where(eq(BlogTable.authorId, filter.user_id));
    }

    if (filter?.organization_id) {
      query = query.where(eq(BlogTable.organizationId, filter.organization_id));
    }

    if (filter?.search) {
      query = query
        .innerJoin(
          BlogMetadataTable,
          eq(BlogMetadataTable.blogId, BlogTable.id),
        )
        .where(
          or(
            ilike(BlogMetadataTable.title, filter.search),
            ilike(BlogTable.slug, filter.search),
          ),
        );
    }

    if (sort?.title)
      query = query.orderBy(
        sql`"${BlogMetadata.tableName}"."title" ${sort.title}`,
      );

    if (sort?.status)
      query = query.orderBy(sql`"${tableName}"."status" ${sort.status}`);
    if (sort?.slug)
      query = query.orderBy(sql`"${tableName}"."slug" ${sort.slug}`);

    if (sort?.created_at) {
      query = query.orderBy(
        sql`"${tableName}"."created_at" ${sort.created_at}`,
      );
    }

    if (sort?.updated_at) {
      query = query.orderBy(
        sql`"${tableName}"."updated_at" ${sort.updated_at}`,
      );
    }

    if (sort?.author_name) {
      query = query.orderBy(
        sql`"${OrganizationMember.tableName}"."name" ${sort.author_name}`,
      );
    }

    return query;
  };

  export const count = async (
    filters?: ListBlogSortFilterInterface["filter"],
  ) => {
    let query = db.select({ count: drizzleCount() }).from(BlogTable).$dynamic();

    if (filters?.status) {
      query = query.where(eq(BlogTable.status, filters.status));
    }

    if (filters?.user_id) {
      query = query.where(eq(BlogTable.authorId, filters.user_id));
    }

    if (filters?.organization_id) {
      query = query.where(
        eq(BlogTable.organizationId, filters.organization_id),
      );
    }

    if (filters?.search) {
      query = query
        .innerJoin(
          BlogMetadataTable,
          eq(BlogMetadataTable.blogId, BlogTable.id),
        )
        .where(
          or(
            ilike(BlogMetadataTable.title, filters.search),
            ilike(BlogTable.slug, filters.search),
          ),
        );
    }

    const res = (await query)[0];
    return res?.count ?? 0;
  };

  export async function remove(id: string): Promise<void> {
    await db.delete(BlogTable).where(eq(BlogTable.id, id));
  }
}
