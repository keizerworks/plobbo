import { factory } from "@plobbo/api/factory";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { Organization } from "@plobbo/db/organization/index";

export const listOrganizationHanlder = factory.createHandlers(
  enforceAuthMiddleware,
  async (c) => c.json(await Organization.findAll({ userId: c.var.user.id })),
);
