import { z } from "zod";

export const createBlogMetadataSchema = z.object({
  blog_id: z.string().min(1, "Blog ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  keywords: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().optional(),
  og_url: z.string().optional(),
});

export type CreateBlogMetadataInterface = z.infer<
  typeof createBlogMetadataSchema
>;
