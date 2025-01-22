import { blog_status } from "db/enums";
import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z
    .string()
    .min(2, {
      message: "Slug must be at least 2 characters.",
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must contain only lowercase letters, numbers, and hyphens.",
    }),
  image: z.instanceof(File).optional(),
  tags: z.array(z.string()).default([]),
  status: z
    .enum([blog_status.PUBLISHED, blog_status.DRAFT])
    .default(blog_status.DRAFT),
});

export const createBlogMutationSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  content: z.string().optional(),
  body: z.array(z.any()).optional(),
  tags: z.array(z.string()).default([]),
  status: z
    .enum([blog_status.PUBLISHED, blog_status.DRAFT])
    .default(blog_status.DRAFT),
});

export type CreateBlogInterface = z.infer<typeof createBlogSchema>;
