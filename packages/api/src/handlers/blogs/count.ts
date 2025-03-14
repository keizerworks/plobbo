import { zValidator } from "@hono/zod-validator";

import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { Blog } from "@plobbo/db/blog/index";
import { listBlogFitlerSchema } from "@plobbo/validator/blog/list";

export const countBlogHandler = factory.createHandlers(
  enforeAuthMiddleware,
  zValidator("query", listBlogFitlerSchema),
  async (c) => {
    const query = c.req.valid("query");
    const userId = c.var.user.id;
    const count = await Blog.count({ ...query, userId });
    return c.json({ count });
  },
);
