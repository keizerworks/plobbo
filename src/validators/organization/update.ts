import { OrganizationTable } from "db/organization/organization.sql";
import { createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const updateOrganizationSchema = createUpdateSchema(OrganizationTable, {
  name: (schema) =>
    schema.min(2, {
      message: "Organization name must be at least 2 characters.",
    }),
  slug: (schema) =>
    schema.min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug must contain only lowercase letters, numbers, and hyphens.",
    }),
}).extend({
  logo: z.instanceof(File).optional(),
});

export const updateOrganizationMutationSchema = createUpdateSchema(
  OrganizationTable,
  {
    name: (schema) =>
      schema.min(2, {
        message: "Organization name must be at least 2 characters.",
      }),
    slug: (schema) =>
      schema.min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message:
          "Slug must contain only lowercase letters, numbers, and hyphens.",
      }),
  },
).extend({
  updateLogo: z.boolean().default(false),
});

export type UpdateOrganizationInterface = z.infer<
  typeof updateOrganizationSchema
>;
