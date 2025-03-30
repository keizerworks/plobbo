import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { updateDistributionWithACMCert } from "@plobbo/api/lib/cloudfront";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforcePremiumMiddleware } from "@plobbo/api/middleware/has-premium";
import { enforceHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import cache from "@plobbo/cache";
import { OrganizationDomain } from "@plobbo/db/organization/domain";

export const verifyCnameOrgDomainHandler = factory.createHandlers(
  enforceAuthMiddleware,
  enforceHasOrgMiddleware("param"),
  enforcePremiumMiddleware,

  zValidator("param", z.object({ id: z.string() })),

  async (c) => {
    const id = c.req.valid("param").id;
    const record = await OrganizationDomain.findUnique(id);

    if (!record) {
      throw new HTTPException(400, {
        message: "No verification request found for this domain",
      });
    }

    if (!record.verified) {
      throw new HTTPException(400, {
        message:
          "Please verify domain ownership first before configuring CNAME",
      });
    }

    try {
      await updateDistributionWithACMCert(record.domain, record.certificateArn);
    } catch (error) {
      console.log(error);
      throw new HTTPException(500);
    }

    record.cnameVerified = true;

    await Promise.all([
      OrganizationDomain.update(record),
      cache.set(`domain:${record.domain}`, c.var.organization.slug),
    ]);

    return c.json({
      message:
        "Domain verified successfully! Your custom domain is now ready to use.",
    });
  },
);
