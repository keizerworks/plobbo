import { zValidator } from "@hono/zod-validator";
import { Resource } from "sst/resource";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { getACMValidationOption } from "@plobbo/api/lib/acm";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforcePremiumMiddleware } from "@plobbo/api/middleware/has-premium";
import { enforceHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { OrganizationDomain } from "@plobbo/db/organization/domain";

export const getOrgDomainHandler = factory.createHandlers(
  enforceAuthMiddleware,
  enforceHasOrgMiddleware("param"),
  enforcePremiumMiddleware,

  zValidator("param", z.object({ id: z.string() })),

  async (c) => {
    const { id } = c.req.valid("param");

    const record = await OrganizationDomain.findUnique(id);
    let resourceRecord;

    if (record && !record.verified) {
      const acmValidation = await getACMValidationOption(record.certificateArn);
      resourceRecord = acmValidation?.ResourceRecord;
    }

    return c.json(
      record
        ? {
          ...record,
          recordName: `_plobbo.verify.${record.domain}`,
          cloudfrontTarget: record.verified
            ? (process.env.CLOUDFRONT_WWL_URL ?? "").replace(
              /^https?:\/\//,
              "",
            )
            : "",
          resourceRecord,
        }
        : undefined,
    );
  },
);
