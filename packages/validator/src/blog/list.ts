import { z } from "zod";

export enum BlogStatusEnum {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export const listBlogFitlerSchema = z.object({
  status: z.nativeEnum(BlogStatusEnum).optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
  organizationId: z.string().optional(),
  journeyId: z.string().optional(),
});

export const listBlogSortSchema = z.object({
  title: z.enum(["asc", "desc"]).optional(),
  status: z.enum(["asc", "desc"]).optional(),
  slug: z.enum(["asc", "desc"]).optional(),
  createdAt: z.enum(["asc", "desc"]).optional(),
  updatedAt: z.enum(["asc", "desc"]).optional(),
  authorName: z.enum(["asc", "desc"]).optional(),
});

export const listBlogSortFilterSchema = z.object({
  // filter: listBlogFitlerSchema.optional(),
  // sort: listBlogSortSchema.optional(),
  // page: z.number().optional(),
  // perPage: z.number().optional(),
});

export type ListBlogSortFilterInterface = z.infer<
  typeof listBlogSortFilterSchema
>;
