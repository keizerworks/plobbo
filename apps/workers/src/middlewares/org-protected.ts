import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Subjects } from "@plobbo/auth/subjects";
import { getDrizzle } from "@plobbo/core/db/drizzle";
import { OrganizationMember } from "@plobbo/core/db/organization/member";

interface Env {
  Variables: {
    user: Subjects;
    member: OrganizationMember.Model;
  };
}

export const enforeHasOrgMiddleware = createMiddleware<Env>(async (c, next) => {
  const user = c.var.user;
  const organizationId = (await c.req.parseBody()).organizationId;

  if (typeof organizationId !== "string") {
    throw new HTTPException(400, {
      message: "organizationId is required in request body",
    });
  }

  const db = getDrizzle();
  const member = await OrganizationMember.findOne(db, {
    organizationId,
    userId: user.id,
  });

  if (!member) {
    throw new HTTPException(403, {
      message: "You are not a member of this organization",
    });
  }

  c.set("member", member);
  await next();
});
