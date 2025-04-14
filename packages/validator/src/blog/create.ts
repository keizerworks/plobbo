import { z } from "zod";

export const createBlogSchema = z.object({
  organizationId: z.string(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters long",
  }),
  slug: z
    .string()
    .min(2, {
      message: "Slug must be at least 2 characters long",
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug can only contain lowercase letters, numbers, and hyphens. Hyphens cannot be at the start or end.",
    }),
  image: z.instanceof(File).optional(),
  journeyId: z.string(),
});

export type CreateBlogInterface = z.infer<typeof createBlogSchema>;
