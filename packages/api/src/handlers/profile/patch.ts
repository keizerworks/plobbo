import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { User } from "@plobbo/db/user/index";

export const updateProfileHandler = factory.createHandlers(
  enforeAuthMiddleware,
  zValidator(
    "json",
    z.object({
      name: z.string().min(1, "Name cannot be empty")
    })
  ),
  async (c) => {

    const userId = c.var.user.id;
    const { name } = c.req.valid("json");

    const user = await User.findById(userId);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const updatedUser = await User.update({ id: userId, name });

    return c.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  }
);
