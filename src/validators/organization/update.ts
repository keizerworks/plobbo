import { Organization } from "db/organization";
import { z } from "zod";

export const updateOrganizationSchema = Organization.updateSchema.extend({
  logo: z.instanceof(File).optional(),
});

export const updateOrganizationMutationSchema =
  Organization.updateSchema.extend({
    updateLogo: z.boolean().default(false),
  });

export type UpdateOrganizationInterface = z.infer<
  typeof updateOrganizationSchema
>;
