import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { OrganizationMember } from "@plobbo/db/organization/member";

export const getMemberHandler = factory.createHandlers(
  enforeAuthMiddleware,
  async (c) => {
    const memberId = c.req.param("id");

    if (!memberId) {
      return c.json({ error: "Member ID is required" }, 400);
    }

    const member = await OrganizationMember.findById(memberId);

    if (!member) {
      return c.json({ error: "Member not found" }, 404);
    }

    return c.json({ member });
  }
);
