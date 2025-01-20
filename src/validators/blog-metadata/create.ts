import { z } from "zod";

export const createBlogMetadataSchema = z.object({
  blog_id: z.string().uuid(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  keywords: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().url().optional(),
  og_url: z.string().url().optional(),
});

export type CreateBlogMetadataInterface = z.infer<typeof createBlogMetadataSchema>;