import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { OrganizationMember } from "@plobbo/db/organization/member";

export const updateMemberHandler = factory.createHandlers(
  enforceAuthMiddleware,
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
    const userId = c.var.user.id; 

    if (!memberId) {
      return c.json({ error: "Member ID is required" }, 400);
    }
    

    const existingMember = await OrganizationMember.findById(memberId);
    if (!existingMember) {
      return c.json({ error: "Member not found" }, 404);
    }

    const currentUser = await OrganizationMember.findOne({ 
          userId, 
          organizationId: existingMember.organizationId 
    });

    if (!currentUser) {
      return c.json({ error: "Not permitted: You are not part of this organization" }, 403);
    }

    if (data.role && currentUser.role !== "ADMIN") {
      return c.json({ error: "Not permitted: Only admins can update member roles" }, 403);
    }

    const updatedData = currentUser.role === "ADMIN" ? data : { 
      profilePicture: data.profilePicture, 
      bio: data.bio, 
      displayName: data.displayName 
    };

    const updatedMember = await OrganizationMember.update({ id: memberId, ...updatedData });

    return c.json({ message: "Member updated successfully", member: updatedMember });
  }
);
