import {z} from "zod";

export const updateOrganizationSchema = z.object({
    name: z.string().min(2),
    slug: z
        .string()
        .min(2)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    });

export type UpdateOrganizationInterface = z.infer<typeof updateOrganizationSchema>;