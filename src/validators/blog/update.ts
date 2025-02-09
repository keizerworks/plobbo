import { BlogStatusEnum } from "db/blog/blog.sql";
import { z } from "zod";

export const updateBlogSchema = z.object({
  id: z.string(),
  title: z.string().min(2).optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  body: z.array(z.any()).optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(BlogStatusEnum.enumValues).optional(),
});

export type UpdateBlogInterface = z.infer<typeof updateBlogSchema>;
