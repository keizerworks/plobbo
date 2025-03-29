import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { OrganizationMember } from "@plobbo/db/organization/member";

export const updateMemberHandler = factory.createHandlers(
  enforeAuthMiddleware,
  zValidator(
    "json",
    z.object({
      role: z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]).optional(),
      profilePicture: z.string().optional(),
      bio: z.string().optional(),
      displayName: z.string().optional(),
    })
  ),
  async (c) => {
    const memberId = c.req.param("id");
    const data = c.req.valid("json");

    if (!memberId) {
      return c.json({ error: "Member ID is required" }, 400);
    }

    const existingMember = await OrganizationMember.findById(memberId);
    if (!existingMember) {
      return c.json({ error: "Member not found" }, 404);
    }

    const updatedMember = await OrganizationMember.update({ id: memberId, ...data });

    return c.json({ message: "Member updated successfully", member: updatedMember });
  }
);
