/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ACMClient,
  DescribeCertificateCommand,
  RequestCertificateCommand,
} from "@aws-sdk/client-acm";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono/quick";
import { Resource } from "sst/resource";
import { ulid } from "ulid";

import cache from "@plobbo/cache";
import { OrganizationDomain } from "@plobbo/db/organization/domain";
import { Organization } from "@plobbo/db/organization/index";
import { OrganizationMember } from "@plobbo/db/organization/member";
import { createOrganizationSchema } from "@plobbo/validator/organization/create";
import { requestDomainVerificationSchema } from "@plobbo/validator/organization/domain";
import { updateOrganizationSchema } from "@plobbo/validator/organization/update";

import { getACMValidationOption } from "../../lib/acm";
import { deleteFile, uploadFile } from "../../lib/bucket";
import { updateDistributionWithACMCert } from "../../lib/cloudfront";
import { enforeAuthMiddleware } from "../../middleware/auth";
import { enforeHasOrgMiddleware } from "../../middleware/org-protected";

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
    console.log(error);
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

organizationsRouter.post(
  "/:id/domain/request-verification",
  enforeHasOrgMiddleware,
  zValidator("form", requestDomainVerificationSchema),
  async (c) => {
    const id = c.req.param("id");
    const { domain } = c.req.valid("form");

    const acm = new ACMClient({ region: "us-east-1" });
    let certificateArn;

    try {
      const certRequest = new RequestCertificateCommand({
        DomainName: domain,
        ValidationMethod: "DNS",
      });
      const certResponse = await acm.send(certRequest);
      certificateArn = certResponse.CertificateArn!;

      const describeCmd = new DescribeCertificateCommand({
        CertificateArn: certificateArn,
      });
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
      certificateArn,
      organizationId: id,
    });

    return c.json({
      message:
        "Add the following TXT record to your DNS to verify domain ownership:",
    });
  },
);

organizationsRouter.post(
  "/:id/domain/verify-cname",
  enforeHasOrgMiddleware,
  async (c) => {
    const id = c.req.param("id");
    const record = await OrganizationDomain.get(id);

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

    // try {
    //   const cnameRecords = await dns.resolveCname(record.domain);
    //   const cloudfrontDomain = Resource.CloudfrontWWWUrl.value.replace(
    //     /^https?:\/\//,
    //     "",
    //   );
    //
    //   console.log(cnameRecords);
    //   if (!cnameRecords.some((cname) => cname === cloudfrontDomain)) {
    //     throw new HTTPException(400, {
    //       message: `CNAME record for ${record.domain} is not properly configured. It should point to ${cloudfrontDomain}. Note that DNS changes can take up to 24-48 hours to propagate - please try again later if you've recently added the record.`,
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    //   throw new HTTPException(400, {
    //     message: `Unable to verify CNAME record for ${record.domain}. Please ensure it points to ${Resource.CloudfrontWWWUrl.value}. Note that DNS changes can take up to 24-48 hours to propagate - please try again later if you've recently added the record.`,
    //   });
    // }

    try {
      await updateDistributionWithACMCert(record.domain, record.certificateArn);
    } catch (error) {
      console.log(error);
      throw new HTTPException(500);
    }

    record.cnameVerified = true;

    await Promise.all([
      OrganizationDomain.update(record),
      cache.set(`domain:${record.domain}`, JSON.stringify(record)),
    ]);

    return c.json({
      message:
        "Domain verified successfully! Your custom domain is now ready to use.",
    });
  },
);

organizationsRouter.post(
  "/:id/domain/verify",
  enforeHasOrgMiddleware,
  async (c) => {
    const id = c.req.param("id");
    const record = await OrganizationDomain.get(id);

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

organizationsRouter.patch(
  "/:id",
  enforeHasOrgMiddleware,
  zValidator("form", updateOrganizationSchema),
  async (c) => {
    const id = c.req.param("id");
    const { logo, ...body } = c.req.valid("form");
    const input: Organization.UpdateInput = { ...body, id };
    const organization = c.var.organization;

    try {
      if (logo && logo.size > 0) {
        const filename = `organization/${ulid()}-${organization.slug}`;
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

      return c.json(updatedOrganization);
    } catch (error) {
      throw new HTTPException(500, {
        message: "Failed to update organization",
        cause: error,
      });
    }
  },
);

organizationsRouter.get(
  "/:id/domain",
  enforeHasOrgMiddleware,
  async ({ req, json }) => {
    const record = await OrganizationDomain.get(req.param("id"));
    let resourceRecord;

    if (record && !record.verified) {
      const acmValidation = await getACMValidationOption(record.certificateArn);
      resourceRecord = acmValidation?.ResourceRecord;
    }

    return json(
      record
        ? {
            ...record,
            recordName: `_plobbo.verify.${record.domain}`,
            cloudfrontTarget: record.verified
              ? Resource.CloudfrontWWWUrl.value.replace(/^https?:\/\//, "")
              : "",
            resourceRecord,
          }
        : undefined,
    );
  },
);

// eslint-disable-next-line @typescript-eslint/require-await
organizationsRouter.get("/:id", enforeHasOrgMiddleware, async (c) =>
  c.json(c.var.organization),
);

export default organizationsRouter;
