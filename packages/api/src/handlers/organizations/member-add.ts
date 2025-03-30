import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforceHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { OrganizationMember } from "@plobbo/db/organization/member";
import { User } from "@plobbo/db/user/index";
import { sendMail } from "@plobbo/core/mailer/index";



export const addMemberHandler = factory.createHandlers(
  enforceAuthMiddleware,
  enforceHasOrgMiddleware("param"),
  zValidator(
    "json",
    z.object({
      userId: z.string().min(1),
      role: z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]),
      profilePicture: z.string().optional(),
      bio: z.string().optional(),
      displayName: z.string().optional(),
    })
  ),
  async (c) => {
    const organizationId = c.var.organization.id;
    const currentUserId = c.var.user.id;

    const currentUserMember = await OrganizationMember.findOne({
            userId: currentUserId,
            organizationId,
    });

    if (!currentUserMember || !["ADMIN", "OWNER"].includes(currentUserMember.role)) {
      return c.json({ error: "Not permitted. Only Admins can add members." }, 403);
    }

    const { userId, role, profilePicture, bio, displayName } = c.req.valid("json");

    const user = await User.findById(userId);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const newMember = await OrganizationMember.create({
      userId,
      organizationId,
      role,
      profilePicture,
      bio,
      displayName
    });

    await sendMail({
      to: { addr: user.email },
      subject: `You've been added to ${c.var.organization.name}!`,
      message: {
        type: "html",
        data: `<p>Hello ${user.name},</p>
                 <p>You have been added as a <b>${role}</b> to the organization <b>${c.var.organization.name}</b>.</p>
                 <p>Sign in to manage your role.</p>
                 <p>Best,<br>Team Plobbo</p>`,
      }
    });


    return c.json({ message: "Member added successfully", member: newMember });
  }
);
