import { z } from "zod";

export const patchBlogSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: "Title must be at least 2 characters long",
        })
        .optional(),
    slug: z
        .string()
        .min(2, {
            message: "Slug must be at least 2 characters long",
        })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message:
                "Slug can only contain lowercase letters, numbers, and hyphens. Hyphens cannot be at the start or end.",
        })
        .optional(),
    image: z.instanceof(File).optional(),
    body: z.array(z.any().optional()).optional(),
    content: z.string().optional(),
});

export type CreateBlogInterface = z.infer<typeof patchBlogSchema>;
