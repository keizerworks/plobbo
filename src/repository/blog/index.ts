import type { blog_status } from "db/enums";
import type { DB } from "db/types";
import type { Insertable } from "kysely";
import type { ListBlogSortFilterInterface } from "validators/blog/list";
import { db } from "db";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { uuidv7 } from "uuidv7";

export type InsertBlogInterface = Omit<Insertable<DB["blog"]>, "id">;

export interface BlogWithInterface {
  organization?: boolean;
  author?: boolean;
}

export interface BlogFilterInterface {
  search?: string;
  organization_id?: string;
  author_id?: string;
  status?: blog_status;
}

export const insertBlog = async (values: InsertBlogInterface) => {
  return await db
    .insertInto("blog")
    .values({ ...values, id: uuidv7() })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getBlog = async (id: string) => {
  return await db
    .selectFrom("blog")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
};

export const getBlogBySlug = async (slug: string) => {
  return await db
    .selectFrom("blog")
    .selectAll()
    .where("slug", "=", slug)
    .executeTakeFirstOrThrow();
};

export const getBlogs = async (
  { filter, sort }: ListBlogSortFilterInterface,
  withRel?: BlogWithInterface,
) => {
  const query = db
    .selectFrom("blog")
    .select([
      "blog.updated_at",
      "blog.created_at",
      "blog.id",
      "blog.title",
      "blog.body",
      "blog.slug",
      "blog.status",
      "blog.organization_id",
      "blog.author_id",
    ])
    .$if(!!withRel?.organization, (qb) =>
      qb.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom("organization")
            .selectAll("organization")
            .whereRef("organization.id", "=", "blog.organization_id"),
        ).as("organization"),
      ),
    )
    .$if(!!withRel?.author, (qb) =>
      qb.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom("organization_member")
            .selectAll("organization_member")
            .whereRef("organization_member.id", "=", "blog.author_id"),
        ).as("author"),
      ),
    )
    .$if(!!filter?.search, (qb) =>
      qb.where((eb) =>
        eb.or([
          eb("title", "ilike", `%${filter?.search}%`),
          eb("slug", "ilike", `%${filter?.search}%`),
        ]),
      ),
    )
    .$if(!!filter?.organization_id, (qb) =>
      qb.where("blog.organization_id", "=", "" + filter?.organization_id),
    )
    .$if(!!filter?.status, (qb) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      qb.where("blog.status", "=", filter!.status!),
    )
    // .$if(!!filter?.author_id, (qb) =>
    //   qb.where("blog.author_id", "=", filter.author_id),
    // )
    .$if(!!sort?.created_at, (qb) => qb.orderBy("created_at", sort?.created_at))
    .$if(!!sort?.title, (qb) => qb.orderBy("title", sort?.title))
    .$if(!!sort?.status, (qb) => qb.orderBy("status", sort?.status))
    .$if(!!sort?.slug, (qb) => qb.orderBy("slug", sort?.slug))
    .$if(!!withRel?.author && !!sort?.author_name, (qb) =>
      qb.orderBy(sql`author.org_metadata->>'display_name'`, sort?.author_name),
    );

  return await query.execute();
};

export const getBlogsCount = async (
  filter?: ListBlogSortFilterInterface["filter"],
) => {
  const result = await db
    .selectFrom("blog")
    .select((eb) => eb.fn.countAll().as("count"))
    .$if(!!filter?.search, (qb) =>
      qb.where((eb) =>
        eb.or([
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eb("title", "ilike", `%${filter!.search!}%`),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          eb("slug", "ilike", `%${filter!.search!}%`),
        ]),
      ),
    )
    .$if(!!filter?.organization_id, (qb) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      qb.where("blog.organization_id", "=", filter!.organization_id!),
    )
    // .$if(!!filter?.author_id, (qb) =>
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   qb.where("blog.author_id", "=", filter!.author_id),
    // )
    .executeTakeFirstOrThrow();

  return Number(result.count);
};

export const updateBlog = async (
  id: string,
  values: Omit<Partial<InsertBlogInterface>, "id">,
) => {
  await db
    .updateTable("blog")
    .where("id", "=", id)
    .set(values)
    .executeTakeFirstOrThrow();
};

export const deleteBlog = async (id: string) => {
  await db.deleteFrom("blog").where("id", "=", id).execute();
};

export const deleteBlogs = async (ids: string[]) => {
  await db.deleteFrom("blog").where("id", "in", ids).execute();
};

export const deleteBlogsByOrganization = async (organizationId: string) => {
  await db
    .deleteFrom("blog")
    .where("organization_id", "=", organizationId)
    .execute();
};
