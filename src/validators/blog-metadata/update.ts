import { z } from "zod";

export const updateBlogMetadataSchema = z.object({
  blog_id: z.string().uuid(),
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  keywords: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  og_image: z.string().url().optional(),
  og_url: z.string().url().optional(),
});

export type UpdateBlogMetadataInterface = z.infer<typeof updateBlogMetadataSchema>;