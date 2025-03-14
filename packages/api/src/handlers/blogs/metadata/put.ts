import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasBlogMiddleware } from "@plobbo/api/middleware/blog-protected";
import { BlogMetadata } from "@plobbo/db/blog/metadata";
import { putBlogMetadataSchema } from "@plobbo/validator/blog/metadata/put";

export const putBlogMetadataHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasBlogMiddleware,

  zValidator("param", z.object({ id: z.string() })),
  zValidator(
    "json",
    putBlogMetadataSchema.omit({
      slug: true,
      title: true,
    }),
  ),

  async (c) => {
    const body = c.req.valid("json");
    return c.json(await BlogMetadata.update(body));
  },
);
