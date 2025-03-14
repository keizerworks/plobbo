import { z } from "zod";

export const putBlogMetadataSchema = z.object({
  blogId: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ogUrl: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export type PutBlogMetadataInterface = z.infer<typeof putBlogMetadataSchema>;
