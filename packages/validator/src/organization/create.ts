import { z } from "zod";

export const createOrganizationSchema = z.object({
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
});

export type CreateOrganizationInterface = z.infer<
  typeof createOrganizationSchema
>;
