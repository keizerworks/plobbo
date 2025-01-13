import { blog_status } from "db/enums";
import { z } from "zod";

export const updateBlogSchema = z.object({
  id: z.string(),
  title: z.string().min(2).optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  body: z.string().min(1).optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum([blog_status.PUBLISHED, blog_status.DRAFT]).optional(),
});

export type UpdateBlogInterface = z.infer<typeof updateBlogSchema>;
