// import { count, like, or, sql } from "drizzle-orm";
// import { db } from "../../db";
// import { BlogTable } from "../../db/schema/blog";
// import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";

// let blogCache: any[] | null = null; // Global cache

// function withPagination<T extends SQLiteSelectQueryBuilder>(
//   qb: T,
//   page: number,
//   pageSize: number
// ) {
//   return qb.limit(pageSize).offset((page - 1) * pageSize);
// }

// export const fetchBlogsWithCache = async (limit: number, offset: number, search?: string) => {
//   if (!blogCache) {
//     // Fetch the first 100 blogs from the database
//     blogCache = await db
//       .select()
//       .from(BlogTable)
//       .orderBy(sql`${BlogTable.createdAt} DESC`)
//       .limit(100);
//   }

//   const paginatedBlogs = blogCache.slice(offset, offset + limit);

//   return {
//     blogs: paginatedBlogs,
//     total: blogCache.length, // Total is always the full length of the cache
//   };
// };

// // export const fetchBlogsWithSearch = async (limit: number, offset: number, search: string) => {
// //   const blogs = await db
// //     .select()
// //     .from(BlogTable)
// //     .where(
// //       or(
// //         like(BlogTable.title, `%${search}%`),
// //         like(BlogTable.body, `%${search}%`)
// //       )
// //     )
// //     .orderBy(sql`${BlogTable.createdAt} DESC`)
// //     .limit(limit)
// //     .offset(offset);

// //   const [{ value: total }] = await db
// //     .select({ value: sql<number>`COUNT(*)` })
// //     .from(BlogTable)
// //     .where(
// //       or(
// //         like(BlogTable.title, `%${search}%`),
// //         like(BlogTable.body, `%${search}%`)
// //       )
// //     );

// //   return { blogs, total };
// // };

import { count, like, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { BlogTable } from "../../db/schema/blog";
import type { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";

// Helper function for pagination
function withPagination<T extends SQLiteSelectQueryBuilder>(
  qb: T,
  page: number,
  pageSize: number
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

// Unified fetch function for blogs
export const fetchBlogs = async (
  page: number,
  pageSize: number,
  search: string = ""
) => {
  // Build base query
  let query = db.select().from(BlogTable).orderBy(sql`${BlogTable.createdAt} DESC`).$dynamic();

  // Add search condition if search is not empty
  if (search) {
    query = query.where(
      or(
        like(BlogTable.title, `%${search}%`),
        like(BlogTable.body, `%${search}%`)
      )
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
        like(BlogTable.body, `%${search}%`)
      )
    );
  }

  const [{ value: total }] = await countQuery.execute();

  return { blogs, total };
};
