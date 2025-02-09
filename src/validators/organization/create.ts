import { OrganizationTable } from "db/organization/organization.sql";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const createOrganizationSchema = createInsertSchema(OrganizationTable, {
  name: (schema) =>
    schema.min(2, {
      message: "Organization name must be at least 2 characters.",
    }),
  slug: (schema) =>
    schema.min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must contain only lowercase letters, numbers, and hyphens.",
    }),
  logo: (s) => s.optional(),
}).extend({
  logo: z.instanceof(File),
});

export type CreateOrganizationInterface = z.infer<
  typeof createOrganizationSchema
>;
