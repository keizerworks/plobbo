import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import { OrganizationSubscription } from "@plobbo/db/subscription/index";

export const enforePremiumMiddleware = createMiddleware(async (c, next) => {
  const id = c.req.param("id");
  if (typeof id !== "string") {
    throw new HTTPException(400, {
      message: "organizationId is required in param",
    });
  }

  const subscription = await OrganizationSubscription.findOne({
    organizationId: id,
  });

  if (!subscription || subscription.status !== "ACTIVE") {
    throw new HTTPException(403, {
      message: "This feature requires an active premium subscription",
    });
  }

  await next();
});
