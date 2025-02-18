import { z } from "zod";

export const updateOrganizationSchema = z
  .object({
    name: z.string().min(2, {
      message: "Organization name must be at least 2 characters.",
    }),
    slug: z
      .string()
      .min(2)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens.",
      }),
    logo: z.instanceof(File),
  })
  .partial()
  .extend({ id: z.string() });

export type UpdateOrganizationInterface = z.infer<
  typeof updateOrganizationSchema
>;
