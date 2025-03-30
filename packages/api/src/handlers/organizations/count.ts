import { HTTPException } from "hono/http-exception";

import { factory } from "@plobbo/api/factory";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { Organization } from "@plobbo/db/organization/index";

export const countOrganizationHandler = factory.createHandlers(
  enforceAuthMiddleware,
  async ({ var: { user }, json }) => {
    try {
      return json({ count: await Organization.count({ userId: user.id }) });
    } catch (error) {
      console.log(error);
      throw new HTTPException(500, {
        message: "Failed to count organizations",
        cause: error,
      });
    }
  },
);
