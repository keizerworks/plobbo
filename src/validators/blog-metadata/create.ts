import { z } from "zod";

export const createBlogMetadataSchema = z.object({
  blog_id: z.string().min(1, "Blog ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  keywords: z.string().optional(),
  og_title: z.string().nullable().optional(),
  og_description: z.string().nullable().optional(),
  og_image: z.string().nullable().optional(),
  og_url: z.string().nullable().optional(),
});

export type CreateBlogMetadataInterface = z.infer<
  typeof createBlogMetadataSchema
>;
