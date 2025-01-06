import { count, like, or, sql } from "drizzle-orm";
import { db } from "../../db";
import { BlogTable } from "../../db/schema/blog";

let blogCache: any[] | null = null; // Global cache

export const fetchBlogsWithCache = async (limit: number, offset: number, search?: string) => {
  if (!blogCache) {
    // Fetch the first 100 blogs from the database
    blogCache = await db
      .select()
      .from(BlogTable)
      .orderBy(sql`${BlogTable.createdAt} DESC`)
      .limit(100);
  }

  const paginatedBlogs = blogCache.slice(offset, offset + limit);

  return {
    blogs: paginatedBlogs,
    total: blogCache.length, // Total is always the full length of the cache
  };
};

// export const fetchBlogsWithSearch = async (limit: number, offset: number, search: string) => {
//   const blogs = await db
//     .select()
//     .from(BlogTable)
//     .where(like(BlogTable.title, `%${search}%`))
//     .orderBy(sql`${BlogTable.createdAt} DESC`)
//     .limit(limit)
//     .offset(offset);

//   const [{ value: total }] = await db
//     .select({ value: sql<number>`COUNT(*)` })
//     .from(BlogTable)
//     .where(like(BlogTable.title, `%${search}%`));

//   return { blogs, total };
// };

export const fetchBlogsWithSearch = async (limit: number, offset: number, search: string) => {
  const blogs = await db
    .select()
    .from(BlogTable)
    .where(
      or(
        like(BlogTable.title, `%${search}%`),
        like(BlogTable.body, `%${search}%`)
      )
    )
    .orderBy(sql`${BlogTable.createdAt} DESC`)
    .limit(limit)
    .offset(offset);

  const [{ value: total }] = await db
    .select({ value: sql<number>`COUNT(*)` })
    .from(BlogTable)
    .where(
      or(
        like(BlogTable.title, `%${search}%`),
        like(BlogTable.body, `%${search}%`)
      )
    );

  return { blogs, total };
};
