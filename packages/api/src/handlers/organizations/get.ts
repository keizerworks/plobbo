import { factory } from "@plobbo/api/factory";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforceHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";

export const getOrganizationHandler = factory.createHandlers(
  enforceAuthMiddleware,
  enforceHasOrgMiddleware("param"),
  // eslint-disable-next-line @typescript-eslint/require-await
  async (c) => c.json(c.var.organization),
);
