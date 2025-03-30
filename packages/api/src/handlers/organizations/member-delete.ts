import { factory } from "@plobbo/api/factory";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { OrganizationMember } from "@plobbo/db/organization/member";

export const deleteMemberHandler = factory.createHandlers(
  enforceAuthMiddleware,
  async (c) => {
    const memberId = c.req.param("id");
    const organizationId = c.req.query("organizationId");

    if (!memberId || !organizationId) {
      return c.json({ error: "Member ID and organizationId are required" }, 400);
    }

    const userId = c.var.user.id;  

    const adminMember = await OrganizationMember.findOne({ 
      userId, 
      organizationId 
    });

    if (!adminMember || adminMember.role !== "ADMIN") {
      return c.json({ error: "Not permitted: Only admins can remove members" }, 403);
    }

    await OrganizationMember.remove({ id: memberId, organizationId });

    return c.json({ message: "Member removed successfully" });
  }
);
