import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { BlogMetadata } from "@plobbo/db/blog/metadata";

export const getBlogMetadataHandler = factory.createHandlers(
  zValidator("param", z.object({ id: z.string() })),
  async (c) => c.json(await BlogMetadata.findUnique(c.req.valid("param").id)),
);
