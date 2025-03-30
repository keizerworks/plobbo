import { factory } from "@plobbo/api/factory";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";

export const getProfileHandler = factory.createHandlers(
  enforceAuthMiddleware,
  // eslint-disable-next-line @typescript-eslint/require-await
  async (c) => c.json(c.var.user),
);
