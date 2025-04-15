import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { ulid } from "ulid";

import { factory } from "@plobbo/api/factory";
import { uploadFile } from "@plobbo/api/lib/bucket";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { Organization } from "@plobbo/db/organization/index";
import { OrganizationMember } from "@plobbo/db/organization/member";
import { createOrganizationSchema } from "@plobbo/validator/organization/create";

export const postOrganizationHandler = factory.createHandlers(
  enforeAuthMiddleware,
  zValidator("form", createOrganizationSchema),

  async (c) => {
    try {
      const body = c.req.valid("form");
      const user = c.var.user;
      const filename = encodeURI(`organization/${ulid()}-${body.slug}`);
      const logoUrl = process.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename;

      try {
        await uploadFile(filename, body.logo);
      } catch (e) {
        console.error(e);
      }

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
      console.log(error);
      throw new HTTPException(500, {
        message: "Failed to create organization",
        cause: error,
      });
    }
  },
);
