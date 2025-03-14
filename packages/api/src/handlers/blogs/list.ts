import { validator } from "hono/validator";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { Blog } from "@plobbo/db/blog/index";
import {
  listBlogFitlerSchema,
  listBlogSortFilterSchema,
} from "@plobbo/validator/blog/list";

export const listBlogsHanlder = factory.createHandlers(
  validator("query", (value, c) => {
    const parsed = listBlogSortFilterSchema
      .extend({
        filter: listBlogFitlerSchema.extend({ organizationId: z.string() }),
      })
      .safeParse({
        filter:
          typeof value.filter === "string"
            ? (JSON.parse(value.filter) as unknown)
            : {},
        sort:
          typeof value.sort === "string"
            ? (JSON.parse(value.sort) as unknown)
            : {},
      });

    if (!parsed.success) return c.json(parsed.error, 400);
    return parsed.data;
  }),
  async (c) => {
    const query = c.req.valid("query");
    const blogs = await Blog.findAll({ ...query, filter: { ...query.filter } });
    return c.json(blogs);
  },
);
