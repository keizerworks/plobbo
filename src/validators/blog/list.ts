import { BlogStatusEnum } from "db/blog/blog.sql";
import { z } from "zod";

export const listBlogFitlerSchema = z.object({
  status: z.enum(BlogStatusEnum.enumValues).optional(),
  user_id: z.string().optional(),
  search: z.string().optional(),
  organization_id: z.string().optional(),
});

export const listBlogSortSchema = z.object({
  title: z.enum(["asc", "desc"]).optional(),
  status: z.enum(["asc", "desc"]).optional(),
  slug: z.enum(["asc", "desc"]).optional(),
  created_at: z.enum(["asc", "desc"]).optional(),
  updated_at: z.enum(["asc", "desc"]).optional(),
  author_name: z.enum(["asc", "desc"]).optional(),
});

export const listBlogSortFilterSchema = z.object({
  filter: listBlogFitlerSchema.optional(),
  sort: listBlogSortSchema.optional(),
});

export type ListBlogSortFilterInterface = z.infer<
  typeof listBlogSortFilterSchema
>;
