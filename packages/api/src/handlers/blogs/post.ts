import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { ulid } from "ulid";

import { factory } from "@plobbo/api/factory";
import { uploadFile } from "@plobbo/api/lib/bucket";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasOrgMiddleware } from "@plobbo/api/middleware/org-protected";
import { and, db, eq } from "@plobbo/db";
import { Blog } from "@plobbo/db/blog/index";
import { BlogMetadata } from "@plobbo/db/blog/metadata";
import { Journey } from "@plobbo/db/journey/index";
import { JourneyTable } from "@plobbo/db/journey/journey.sql";
import { OrganizationTable } from "@plobbo/db/organization/organization.sql";
import { createBlogSchema } from "@plobbo/validator/blog/create";

export const postBlogHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasOrgMiddleware("organizationId"),

  zValidator("form", createBlogSchema),

  async (c) => {
    const body = c.req.valid("form");
    const member = c.var.organization.member;

    const journey = (
      await db
        .select(Journey.columns)
        .from(JourneyTable)
        .innerJoin(
          OrganizationTable,
          eq(JourneyTable.organizaitonId, OrganizationTable.id),
        )
        .where(
          and(
            eq(JourneyTable.id, body.journeyId),
            eq(OrganizationTable.id, body.organizationId),
          ),
        )
    )[0];

    if (!journey) {
      throw new HTTPException(403, {
        message: "Journey not found or you don't have access to it",
      });
    }

    const input: Blog.CreateInput = {
      organizationId: body.organizationId,
      authorId: member.id,
      title: body.title,
      slug: body.title,
      journeyId: body.journeyId,
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
