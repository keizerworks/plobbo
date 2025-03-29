import { factory } from "@plobbo/api/factory";
import { removeDistributionWithACMCert } from "@plobbo/api/lib/cloudfront";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { OrganizationDomain } from "@plobbo/db/organization/domain";

export const deleteOrgDomainHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasOrgMiddleware("param"),

  async (c) => {
    const record = await OrganizationDomain.findUnique(c.var.organization.id);
    if (!record) {
      return c.json({ message: "No domain record found to delete" });
    }

    await Promise.all([
      removeDistributionWithACMCert(record.domain),
      OrganizationDomain.remove(c.var.organization.id),
    ]);

    return c.json({ message: "Domain deleted successfully" });
  },
);
