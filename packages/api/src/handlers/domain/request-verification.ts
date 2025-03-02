import {
  ACMClient,
  DescribeCertificateCommand,
  RequestCertificateCommand,
} from "@aws-sdk/client-acm";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { OrganizationDomain } from "@plobbo/db/organization/domain";
import { requestDomainVerificationSchema } from "@plobbo/validator/organization/domain";

export const requestVerificationOrgDomainHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasOrgMiddleware("param"),

  zValidator("param", z.object({ id: z.string() })),
  zValidator("form", requestDomainVerificationSchema),

  async (c) => {
    const id = c.req.valid("param").id;
    const { domain } = c.req.valid("form");

    const acm = new ACMClient({ region: "us-east-1" });
    let CertificateArn;

    try {
      const certRequest = new RequestCertificateCommand({
        DomainName: domain,
        ValidationMethod: "DNS",
      });

      const certResponse = await acm.send(certRequest);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      CertificateArn = certResponse.CertificateArn!;

      const describeCmd = new DescribeCertificateCommand({ CertificateArn });
      const certDetails = await acm.send(describeCmd);

      if (!certDetails.Certificate?.DomainValidationOptions) {
        throw new HTTPException(500, {
          message: "Failed to get certificate details from ACM",
        });
      }
    } catch (error) {
      console.error("ACM certificate request error:", error);
      throw new HTTPException(500, {
        message: "Error requesting SSL certificate from ACM",
      });
    }

    await OrganizationDomain.create({
      domain,
      certificateArn: CertificateArn,
      organizationId: id,
    });

    return c.json({
      message:
        "Add the following TXT record to your DNS to verify domain ownership:",
    });
  },
);
