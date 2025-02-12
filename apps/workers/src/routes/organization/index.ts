import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { Resource } from "sst/resource";
import { ulid } from "ulid";

import { getDrizzle } from "@plobbo/core/db/drizzle";
import { Organization } from "@plobbo/core/db/organization/index";
import { OrganizationMember } from "@plobbo/core/db/organization/member";
import { MemberRoleEnum } from "@plobbo/core/db/organization/organization.sql";

import { enforeAuthMiddleware } from "~/middlewares/auth";

const organizationRouter = new Hono().use(enforeAuthMiddleware);

organizationRouter.get("/count", async (c) => {
  try {
    const user = c.var.user;
    const count = await Organization.count(getDrizzle(), { userId: user.id });
    return c.json({ count });
  } catch (error) {
    throw new HTTPException(500, {
      message: "Failed to count organizations",
      cause: error,
    });
  }
});

organizationRouter.post(
  zValidator("form", Organization.createSchema),
  async (c) => {
    try {
      const body = c.req.valid("form");
      const user = c.var.user;
      const filename = encodeURI(`${ulid()}-${body.slug}`);
      const logoUrl = `${Resource.CLOUDFLARE_R2_BASE_URL}/${filename}`;
      const db = getDrizzle();

      c.executionCtx.waitUntil(c.env.R2.put(filename, body.logo));

      const organization = await Organization.create(db, {
        name: body.name,
        slug: body.slug,
        logo: logoUrl,
      });

      if (!organization) {
        throw new HTTPException(500, {
          message: "Failed to create organization",
        });
      }

      await OrganizationMember.create(db, {
        userId: user.id,
        organizationId: organization.id,
        role: MemberRoleEnum.ADMIN,
        displayName: user.name,
      });

      return c.json(organization);
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to create organization",
        cause: error,
      });
    }
  },
);

export default organizationRouter;
