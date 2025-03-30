import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { Blog } from "@plobbo/db/blog/index";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";

export const deleteBlogHandler = factory.createHandlers(
  enforceAuthMiddleware,
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const id = c.req.valid("param").id;
    const blog = await Blog.findById(id);

    if (!blog) {
      return c.json({ error: "Blog not found" }, 404);
    }

    const user = c.var.user;

    if (blog.authorId !== user.id) {
      return c.json({ error: "Unauthorized: You can't delete this blog" }, 403);
    }

    await Blog.remove(id);

    return c.json({ message: "Blog deleted successfully" });
  },
);
