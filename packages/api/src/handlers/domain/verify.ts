import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { getACMValidationOption } from "@plobbo/api/lib/acm";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { OrganizationDomain } from "@plobbo/db/organization/domain";

export const verifyOrgDomainHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasOrgMiddleware("param"),

  zValidator("param", z.object({ id: z.string() })),

  async (c) => {
    const id = c.req.valid("param").id;
    const record = await OrganizationDomain.findUnique(id);

    if (!record) {
      throw new HTTPException(400, {
        message: "No verification request found for this domain",
      });
    }

    const acmValidation = await getACMValidationOption(record.certificateArn);
    if (!acmValidation)
      throw new HTTPException(500, {
        message: "Failed to get certificate details from ACM",
      });

    const isACMValid = acmValidation.ValidationStatus === "SUCCESS";
    if (record.verified !== isACMValid) {
      record.verified = isACMValid;
      await OrganizationDomain.update(record);
    }

    if (acmValidation.ValidationStatus === "PENDING_VALIDATION") {
      return c.json({
        status: "pending",
        message:
          "Domain verification is still pending. Please ensure you have added the correct DNS records and try again in a few minutes.",
      });
    }

    if (acmValidation.ValidationStatus === "FAILED") {
      throw new HTTPException(400, {
        message:
          "Domain verification failed. Please try again with correct DNS records.",
      });
    }

    return c.json({
      message:
        "Domain verified successfully. Now, please add a CNAME record pointing your domain to our CloudFront distribution.",
    });
  },
);
