import { z } from "zod";

export const createBlogMetadataSchema = z.object({
  blogId: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  keywords: z.string().nullable(),
  ogTitle: z.string().nullable(),
  ogDescription: z.string().nullable(),
  ogImage: z.string().nullable(),
  ogUrl: z.string().nullable(),
});

export type CreateBlogMetadataInterface = z.infer<
  typeof createBlogMetadataSchema
>;
