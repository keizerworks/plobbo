import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono/quick";
import { validator } from "hono/validator";
import { ulid } from "ulid";
import { z } from "zod";

import { db } from "@plobbo/db";
import { BlogMetadataTable } from "@plobbo/db/blog/blog.sql";
import { Blog } from "@plobbo/db/blog/index";
import { createBlogSchema } from "@plobbo/validator/blog/create";
import {
  listBlogFitlerSchema,
  listBlogSortFilterSchema,
} from "@plobbo/validator/blog/list";
import { patchBlogSchema } from "@plobbo/validator/blog/patch";

import { uploadFile } from "../lib/bucket";
import { enforeAuthMiddleware } from "../middleware/auth";
import { enforeHasBlogMiddleware } from "../middleware/blog-protected";
import { enforeHasOrgMiddleware } from "../middleware/org-protected";

const blogsRouter = new Hono<{ Bindings: { NEXT_PUBLIC_S3_DOMAIN: string } }>();

blogsRouter.post(
  "/",
  zValidator("form", createBlogSchema),
  enforeAuthMiddleware,
  enforeHasOrgMiddleware,
  async (c) => {
    const member = c.var.organization.member;

    const body = c.req.valid("form");
    const input: Blog.CreateInput = {
      organizationId: body.organizationId,
      authorId: member.id,
      title: body.title,
      slug: body.title,
    };

    if (body.image) {
      const filename = "blogs/" + encodeURI(ulid() + "-" + body.slug);
      input.image = c.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename;
      await uploadFile(filename, body.image);
    }

    const blog = await Blog.create(input);

    if (!blog)
      throw new HTTPException(400, { message: "Failed to create blog" });

    await db
      .insert(BlogMetadataTable)
      .values({ blogId: blog.id, description: "" });

    return c.json(blog, 201);
  },
);

blogsRouter.get(
  "/",
  validator("query", (value, c) => {
    const parsed = listBlogSortFilterSchema
      .extend({
        filter: listBlogFitlerSchema.extend({
          organizationId: z.string(),
        }),
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
    const blogs = await Blog.findAll({
      ...query,
      filter: { ...query.filter },
    });

    return c.json(blogs);
  },
);

blogsRouter.get(
  "/count",
  enforeAuthMiddleware,
  zValidator("query", listBlogFitlerSchema),
  async (c) => {
    const query = c.req.valid("query");
    const userId = c.var.user.id;
    const count = await Blog.count({ ...query, userId });
    return c.json({ count });
  },
);

blogsRouter.put(
  "/placeholder-images",
  enforeAuthMiddleware,
  zValidator("form", z.object({ file: z.instanceof(File) })),
  async (c) => {
    const body = c.req.valid("form");
    const filename = "blogs/placeholder-images" + encodeURI(ulid());
    await uploadFile(filename, body.file);
    return c.json({ url: c.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename });
  },
);

blogsRouter.get(
  "/:id",
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const id = c.req.valid("param").id;
    const blog = await Blog.findById(id);
    return c.json(blog);
  },
);

blogsRouter.patch(
  "/:id",
  validator("form", (value, c) => {
    const parsed = patchBlogSchema.safeParse({
      ...value,
      body: Array.isArray(value.body)
        ? value.body.map(
            (item) => JSON.parse(item as unknown as string) as unknown,
          )
        : undefined,
      tags:
        typeof value.tags === "string"
          ? (JSON.parse(value.tags) as unknown)
          : undefined,
    });

    if (!parsed.success) return c.json(parsed.error, 400);
    return parsed.data;
  }),
  // zValidator("form", patchBlogSchema),
  enforeAuthMiddleware,
  enforeHasBlogMiddleware,
  async (c) => {
    const id = c.req.param("id");
    const { image, ...body } = c.req.valid("form");

    const input: Blog.UpdateInput = { ...body, id };

    if (image) {
      const filename = "blogs/" + encodeURI(ulid() + "-" + body.slug);
      input.image = c.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename;
      await uploadFile(filename, image);
    }

    const blog = await Blog.update(input);
    if (!blog)
      throw new HTTPException(400, { message: "Failed to create blog" });

    return c.json(blog);
  },
);

export default blogsRouter;
