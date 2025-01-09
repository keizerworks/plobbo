import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { like, or, sql } from "drizzle-orm";

import { db } from "../../db";
import { BlogTable } from "../../db/schema/blog";

function parseInput(input: any, ctx: any) {
  if (
    ctx.request?.headers
      .get("content-type")
      ?.includes("application/x-www-form-urlencoded")
  ) {
    const formData = new URLSearchParams(ctx.request?.body);
    return {
      page: parseInt(formData.get("page") || "1", 10),
      pageSize: parseInt(formData.get("pageSize") || "10", 10),
      search: formData.get("search") || "",
    };
  }
  return input; // Directly use JSON input
}

// Helper function for pagination
function withPagination<T extends SQLiteSelectQueryBuilder>(
  qb: T,
  page: number,
  pageSize: number,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export const blogs = {
  fetchBlogs: defineAction({
    input: z.object({
      page: z.number().default(1),
      pageSize: z.number().default(10),
      search: z.string().optional(),
    }),
    handler: async ({ page, pageSize, search }) => {
      // Base query
      let query = db
        .select()
        .from(BlogTable)
        .orderBy(sql`${BlogTable.createdAt} DESC`)
        .$dynamic();

      // Add search condition if provided
      if (search) {
        query = query.where(
          or(
            like(BlogTable.title, `%${search}%`),
            like(BlogTable.body, `%${search}%`),
          ),
        );
      }

      // Apply pagination
      const paginatedQuery = withPagination(query, page, pageSize);
      const blogs = await paginatedQuery.execute();

      // Total count query
      let countQuery = db
        .select({ value: sql<number>`COUNT(*)` })
        .from(BlogTable)
        .$dynamic();

      if (search) {
        countQuery = countQuery.where(
          or(
            like(BlogTable.title, `%${search}%`),
            like(BlogTable.body, `%${search}%`),
          ),
        );
      }

      const [{ value: total }] = await countQuery.execute();

      return { blogs, total };
    },
  }),
};
