import { validator } from "hono/validator";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { Blog } from "@plobbo/db/blog/index";
import {
  listBlogFitlerSchema,
  listBlogSortFilterSchema,
} from "@plobbo/validator/blog/list";

export const listBlogsHandler = factory.createHandlers(
  validator("query", (value, c) => {
    console.log("Raw value received:", value);
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

    console.log("Parsed data:", parsed.success ? parsed.data : parsed.error);
    if (!parsed.success) return c.json(parsed.error, 400);
    return parsed.data;
  }),
  async (c) => {
    const query = c.req.valid("query");
    console.log("Query being sent to Blog.findAll:", query);
    const blogs = await Blog.findAll(query);
    console.log("Returned blogs:", blogs.length);
    return c.json(blogs);
  },
);

export const listBlogsByJourneyIdHandler = factory.createHandlers(
  validator("query", (value, c) => {
    const parsed = z.object({
      journeyId: z.string(),
      organizationId: z.string()
    }).safeParse(value);

    if (!parsed.success) return c.json(parsed.error, 400);
    return parsed.data;
  }),
  async (c) => {
    const { journeyId, organizationId } = c.req.valid("query");
    const blogs = await Blog.findAll({
      filter: {
        organizationId,
        journeyId
      }
    });
    return c.json(blogs);
  },
);
