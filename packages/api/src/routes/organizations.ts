import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono/quick";
import { ulid } from "ulid";

import { Organization } from "@plobbo/db/organization/index";
import { OrganizationMember } from "@plobbo/db/organization/member";
import { createOrganizationSchema } from "@plobbo/validator/organization/create";
import { updateOrganizationSchema } from "@plobbo/validator/organization/update";

import { deleteFile, uploadFile } from "../lib/bucket";
import { enforeAuthMiddleware } from "../middleware/auth";
import { enforeHasOrgMiddleware } from "../middleware/org-protected";

interface Env {
  Bindings: { NEXT_PUBLIC_S3_DOMAIN: string };
}

const organizationsRouter = new Hono<Env>().use(enforeAuthMiddleware);

organizationsRouter.get("/", async (c) =>
  c.json(await Organization.findAll({ userId: c.var.user.id })),
);

organizationsRouter.get("/count", async ({ var: { user }, json }) => {
  try {
    return json({ count: await Organization.count({ userId: user.id }) });
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
      const logoUrl = c.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename;
      await uploadFile(filename, body.logo);

      const organization = await Organization.create({
        name: body.name,
        slug: body.slug,
        logo: logoUrl,
      });

      if (!organization) {
        throw new HTTPException(500, {
          message: "Failed to create organization",
        });
      }

      await OrganizationMember.create({
        userId: user.id,
        organizationId: organization.id,
        role: "ADMIN",
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
      const organization = c.var.organization;

      if (logo && logo.size > 0) {
        const filename = `organization/${ulid()}-${organization.slug}`;
        if (organization.logo) {
          const logoPath = organization.logo.split(".com/").pop();
          if (logoPath) await deleteFile(logoPath);
        }
        input.logo = c.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename;
        await uploadFile(filename, logo);
      }

      const updatedOrganization = await Organization.update(input);
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
