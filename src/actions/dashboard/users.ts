import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { count, like, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { UserTable } from "../../db/schema/user";
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";

// Helper function for pagination
function withPagination<T extends SQLiteSelectQueryBuilder>(
  qb: T,
  page: number,
  pageSize: number
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export const users = {
  fetchUsers: defineAction({
    input: z.object({
      page: z.number().min(1).default(1), // Enforce minimum page of 1
      pageSize: z.number().min(1).max(50).default(10), // Limit pageSize to a maximum (optional)
      search: z.string().optional(),
    }),
    handler: async ({ page, pageSize, search }) => {
      // Base query
      let query = db
        .select()
        .from(UserTable)
        .orderBy(sql`${UserTable.createdAt} DESC`)
        .$dynamic();

      // Add search condition if provided
      if (search) {
        query = query.where(
          or(
            like(UserTable.firstName, `%${search}%`),
            like(UserTable.lastName, `%${search}%`),
            like(UserTable.email, `%${search}%`)
          )
        );
      }

      // Apply pagination
      const paginatedQuery = withPagination(query, page, pageSize);
      const users = await paginatedQuery.execute();

      // Total count query
      let countQuery = db
        .select({ value: sql<number>`COUNT(*)` })
        .from(UserTable)
        .$dynamic();

      if (search) {
        countQuery = countQuery.where(
          or(
            like(UserTable.firstName, `%${search}%`),
            like(UserTable.lastName, `%${search}%`),
            like(UserTable.email, `%${search}%`)
          )
        );
      }

      const [{ value: total }] = await countQuery.execute();

      return { users, total };
    },
  }),
};
