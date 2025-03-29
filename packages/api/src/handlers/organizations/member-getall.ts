import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { OrganizationMember } from "@plobbo/db/organization/member";

export const getAllMembersHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasOrgMiddleware("param"),
  async (c) => {
    const organizationId = c.var.organization.id;

    if (!organizationId) {
      return c.json({ error: "organizationId is required" }, 400);
    }

    const members = await OrganizationMember.findAll({ organizationId });

    return c.json({ members });
  }
);
