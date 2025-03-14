import { zValidator } from "@hono/zod-validator";
import { ulid } from "ulid";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { uploadFile } from "@plobbo/api/lib/bucket";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";

export const putBlogPlaceholderImages = factory.createHandlers(
  enforeAuthMiddleware,
  zValidator("form", z.object({ file: z.instanceof(File) })),
  async (c) => {
    const body = c.req.valid("form");
    const filename = "blogs/placeholder-images" + encodeURI(ulid());
    await uploadFile(filename, body.file);
    return c.json({ url: process.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename });
  },
);
