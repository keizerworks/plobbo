import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono/quick";
import { Resource } from "sst/resource";
import { ulid } from "ulid";

import { getDrizzle } from "@plobbo/core/db/drizzle";
import { Organization } from "@plobbo/core/db/organization/index";
import { OrganizationMember } from "@plobbo/core/db/organization/member";
import { MemberRoleEnum } from "@plobbo/core/db/organization/organization.sql";
import { createOrganizationSchema } from "@plobbo/validator/organization/create";
import { updateOrganizationSchema } from "@plobbo/validator/organization/update";

import { enforeAuthMiddleware } from "~/middleware/auth";
import { enforeHasOrgMiddleware } from "~/middleware/org-protected";

const organizationsRouter = new Hono().use(enforeAuthMiddleware);

organizationsRouter.get("/", async (c) =>
  c.json(await Organization.findAll(getDrizzle(), { userId: c.var.user.id })),
);

organizationsRouter.get("/count", async (c) => {
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

organizationsRouter.post(
  "/",
  zValidator("form", createOrganizationSchema),
  async (c) => {
    try {
      const body = c.req.valid("form");
      const user = c.var.user;
      const filename = encodeURI(`organization/${ulid()}-${body.slug}`);
      const logoUrl = `${Resource.CLOUDFLARE_R2_BASE_URL.value}/${filename}`;
      const db = getDrizzle();

      c.executionCtx.waitUntil(Resource.r2.put(filename, body.logo));

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

organizationsRouter.patch(
  "/",
  enforeHasOrgMiddleware,
  zValidator("form", updateOrganizationSchema),
  async (c) => {
    try {
      const { logo, ...body } = c.req.valid("form");
      const input: Organization.UpdateInput = { ...body };

      const db = getDrizzle();
      const organization = c.var.organization;

      if (logo && logo.size > 0) {
        const filename = `organization/${ulid()}-${organization.slug}`;
        if (organization.logo) {
          const logoPath = organization.logo.split(".com/").pop();
          if (logoPath) await Resource.r2.delete(logoPath);
        }
        const file = await Resource.r2.put(filename, logo);
        if (file)
          input.logo = `${Resource.CLOUDFLARE_R2_BASE_URL.value}/${file.key}`;
      }

      const updatedOrganization = await Organization.update(db, input);
      if (!updatedOrganization) {
        throw new HTTPException(500, {
          message: "Failed to update organization",
        });
      }

      return c.json(updatedOrganization);
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to create organization",
        cause: error,
      });
    }
  },
);

export default organizationsRouter;
