import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { Organization } from "@plobbo/db/organization/index";

export const listOrganizationHandler = factory.createHandlers(
  enforeAuthMiddleware,
  async (c) => c.json(await Organization.findAll({ userId: c.var.user.id })),
);
