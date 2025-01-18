import { blog_status } from "db/enums";
import { z } from "zod";

export const listBlogFitlerSchema = z.object({
  status: z.enum([blog_status.PUBLISHED, blog_status.DRAFT]).optional(),
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
