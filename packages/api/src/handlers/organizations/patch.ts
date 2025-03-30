import { revalidatePath } from "next/cache";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { ulid } from "ulid";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { deleteFile, uploadFile } from "@plobbo/api/lib/bucket";
import { invalidateCloudFrontPaths } from "@plobbo/api/lib/cloudfront";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforceHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import cache from "@plobbo/cache";
import { OrganizationDomain } from "@plobbo/db/organization/domain";
import { Organization } from "@plobbo/db/organization/index";
import { updateOrganizationSchema } from "@plobbo/validator/organization/update";

export const patchOrganizationHandler = factory.createHandlers(
  enforceAuthMiddleware,
  enforceHasOrgMiddleware("param"),

  zValidator("form", updateOrganizationSchema),
  zValidator("param", z.object({ id: z.string() })),

  async (c) => {
    const { logo, ...body } = c.req.valid("form");
    const { id } = c.req.valid("param");

    const input: Organization.UpdateInput = { ...body, id };
    const organization = c.var.organization;

    try {
      if (logo && logo.size > 0) {
        const filename =
          "organizations/" + encodeURI(ulid() + "-" + organization.slug);

        if (organization.logo) {
          const logoPath = organization.logo.split(".com/").pop();
          if (logoPath) await deleteFile(logoPath);
        }

        input.logo = process.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename;
        await uploadFile(filename, logo);
      }

      const updatedOrganization = await Organization.update(input);
      if (!updatedOrganization) {
        throw new HTTPException(500, {
          message: "Failed to update organization",
        });
      }

      if (updatedOrganization.slug !== organization.slug) {
        try {
          revalidatePath(`/${organization.slug}/[blog-slug]/page`, "page");
          await invalidateCloudFrontPaths([`/${organization.slug}/*`]);

          const customDomainRecord = await OrganizationDomain.findUnique(id);
          if (customDomainRecord) {
            await cache.set(
              `domain:${customDomainRecord.domain}`,
              c.var.organization.slug,
            );
          }
        } catch (e) {
          console.error(e);
        }
      }

      return c.json(updatedOrganization);
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to update organization",
        cause: error,
      });
    }
  },
);
