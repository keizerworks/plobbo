import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { ulid } from "ulid";

import { factory } from "@plobbo/api/factory";
import { uploadFile } from "@plobbo/api/lib/bucket";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforceHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { Blog } from "@plobbo/db/blog/index";
import { BlogMetadata } from "@plobbo/db/blog/metadata";
import { createBlogSchema } from "@plobbo/validator/blog/create";

export const postBlogHandler = factory.createHandlers(
  enforceAuthMiddleware,
  enforceHasOrgMiddleware("organizationId"),

  zValidator("form", createBlogSchema),

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
      input.image = process.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename;
      await uploadFile(filename, body.image);
    }

    const blog = await Blog.create(input);
    if (!blog)
      throw new HTTPException(400, { message: "Failed to create blog" });
    await BlogMetadata.create({ blogId: blog.id, description: "" });

    return c.json(blog, 201);
  },
);
