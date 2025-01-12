import { blog_status } from "db/enums";
import { z } from "zod";

export const listBlogFitlerSchema = z.object({
  status: z.enum([blog_status.PUBLISHED, blog_status.DRAFT]).optional(),
  user_id: z.string().optional(),
});

export type ListBlogFilterInterface = z.infer<typeof listBlogFitlerSchema>;
