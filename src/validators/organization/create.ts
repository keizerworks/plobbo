import { Organization } from "db/organization";
import { z } from "zod";

export const createOrganizationSchema = Organization.createSchema.extend({
  logo: z.instanceof(File),
});

export type CreateOrganizationInterface = z.infer<
  typeof createOrganizationSchema
>;
