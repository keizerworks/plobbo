import { zValidator } from "@hono/zod-validator";

import { factory } from "@plobbo/api/factory";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { Blog } from "@plobbo/db/blog/index";
import { listBlogFitlerSchema } from "@plobbo/validator/blog/list";

export const countBlogHandler = factory.createHandlers(
  enforceAuthMiddleware,
  zValidator("query", listBlogFitlerSchema),
  async (c) => {
    const query = c.req.valid("query");
    const userId = c.var.user.id;
    const count = await Blog.count({ ...query, userId });
    return c.json({ count });
  },
);
