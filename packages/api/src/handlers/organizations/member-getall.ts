import { factory } from "@plobbo/api/factory";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforceHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { OrganizationMember } from "@plobbo/db/organization/member";

export const getAllMembersHandler = factory.createHandlers(
  enforceAuthMiddleware,
  enforceHasOrgMiddleware("param"),
  async (c) => {
    const organizationId = c.var.organization.id;

    if (!organizationId) {
      return c.json({ error: "organizationId is required" }, 400);
    }

    const members = await OrganizationMember.findAll({ organizationId });

    return c.json({ members });
  }
);
