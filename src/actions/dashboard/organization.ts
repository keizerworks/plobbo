// src/actions/organizations.ts
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { count, like, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { OrganizationTable } from "../../db/schema/organization";
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";

// Helper function for pagination
function withPagination<T extends SQLiteSelectQueryBuilder>(
  qb: T,
  page: number,
  pageSize: number
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export const organizations = {
  fetchOrganizations: defineAction({
    input: z.object({
      page: z.number().min(1).default(1), // Enforce minimum page of 1
      pageSize: z.number().min(1).max(50).default(10), // Limit pageSize to a maximum (optional)
      search: z.string().optional(),
    }),
    handler: async ({ page, pageSize, search }) => {
      // Base query
      let query = db
        .select()
        .from(OrganizationTable)
        .orderBy(sql`${OrganizationTable.createdAt} DESC`)
        .$dynamic();

      // Add search condition if provided
      if (search) {
        query = query.where(
          or(
            like(OrganizationTable.name, `%${search}%`),
            like(OrganizationTable.subdomain, `%${search}%`),
            like(OrganizationTable.customDomain, `%${search}%`)
          )
        );
      }

      // Apply pagination
      const paginatedQuery = withPagination(query, page, pageSize);
      const organizations = await paginatedQuery.execute();

      // Total count query
      let countQuery = db
        .select({ value: sql<number>`COUNT(*)` })
        .from(OrganizationTable)
        .$dynamic();

      if (search) {
        countQuery = countQuery.where(
          or(
            like(OrganizationTable.name, `%${search}%`),
            like(OrganizationTable.subdomain, `%${search}%`),
            like(OrganizationTable.customDomain, `%${search}%`)
          )
        );
      }

      const [{ value: total }] = await countQuery.execute();

      return { organizations, total };
    },
  }),
};
