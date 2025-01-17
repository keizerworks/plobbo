import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  logo: z.instanceof(File).optional(),
});

export const updateOrganizationMutationSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  updateLogo: z.boolean().default(false),
});

export type UpdateOrganizationInterface = z.infer<
  typeof updateOrganizationSchema
>;
