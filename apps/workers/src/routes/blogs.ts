import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono/quick";
import { validator } from "hono/validator";
import { Resource } from "sst/resource";
import { ulid } from "ulid";
import { z } from "zod";

import { BlogMetadataTable } from "@plobbo/core/db/blog/blog.sql";
import { Blog } from "@plobbo/core/db/blog/index";
import { getDrizzle } from "@plobbo/core/db/drizzle";
import { createBlogSchema } from "@plobbo/validator/blog/create";
import {
    listBlogFitlerSchema,
    listBlogSortFilterSchema,
} from "@plobbo/validator/blog/list";
import { patchBlogSchema } from "@plobbo/validator/blog/patch";

import { enforeAuthMiddleware } from "~/middleware/auth";
import { enforeHasBlogMiddleware } from "~/middleware/blog-protected";
import { enforeHasOrgMiddleware } from "~/middleware/org-protected";

const blogsRouter = new Hono();

blogsRouter.post(
    "/",
    zValidator("form", createBlogSchema),
    enforeAuthMiddleware,
    enforeHasOrgMiddleware,
    async (c) => {
        const member = c.var.organization.member;
        const db = c.var.db;

        const body = c.req.valid("form");
        const input: Blog.CreateInput = {
            organizationId: body.organizationId,
            authorId: member.id,
            title: body.title,
            slug: body.title,
        };

        if (body.image) {
            const filename = "blogs/" + encodeURI(ulid() + "-" + body.slug);
            input.image =
                Resource.CLOUDFLARE_R2_BASE_URL.value + "/" + filename;
            c.executionCtx.waitUntil(Resource.r2.put(filename, body.image));
        }

        const blog = await Blog.create(db, input);

        if (!blog)
            throw new HTTPException(400, { message: "Failed to create blog" });

        c.executionCtx.waitUntil(
            db
                .insert(BlogMetadataTable)
                .values({ blogId: blog.id, description: "" }),
        );

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
        const db = getDrizzle();

        const blogs = await Blog.findAll(db, {
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
        const db = getDrizzle();
        const count = await Blog.count(db, { ...query, userId });
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
        await Resource.r2.put(filename, body.file);
        return c.json({
            url: Resource.CLOUDFLARE_R2_BASE_URL.value + "/" + filename,
        });
    },
);

blogsRouter.get(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
        const id = c.req.valid("param").id;
        const db = getDrizzle();
        const blog = await Blog.findById(db, id);
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
                      (item) =>
                          JSON.parse(item as unknown as string) as unknown,
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
        const db = c.var.db;
        const id = c.req.param("id");
        const { image, ...body } = c.req.valid("form");

        console.log(body);

        const input: Blog.UpdateInput = { ...body, id };

        if (image) {
            const filename = "blogs/" + encodeURI(ulid() + "-" + body.slug);
            input.image =
                Resource.CLOUDFLARE_R2_BASE_URL.value + "/" + filename;
            c.executionCtx.waitUntil(Resource.r2.put(filename, image));
        }

        const blog = await Blog.update(db, input);
        if (!blog)
            throw new HTTPException(400, { message: "Failed to create blog" });

        return c.json(blog);
    },
);

export default blogsRouter;
