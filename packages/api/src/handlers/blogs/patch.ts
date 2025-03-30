import { revalidatePath } from "next/cache";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { validator } from "hono/validator";
import { ulid } from "ulid";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { uploadFile } from "@plobbo/api/lib/bucket";
import { invalidateCloudFrontPaths } from "@plobbo/api/lib/cloudfront";
import { enforceAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforceHasBlogMiddleware } from "@plobbo/api/middleware/blog-protected";
import { Blog } from "@plobbo/db/blog/index";
import { OrganizationDomain } from "@plobbo/db/organization/domain";
import { patchBlogSchema } from "@plobbo/validator/blog/patch";

export const patchBlogHanlder = factory.createHandlers(
  enforceAuthMiddleware,
  enforceHasBlogMiddleware,

  zValidator("param", z.object({ id: z.string() })),

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

  async (c) => {
    const id = c.req.valid("param").id;
    const { image, ...body } = c.req.valid("form");

    const input: Blog.UpdateInput = { ...body, id };

    if (image) {
      const filename = "blogs/" + encodeURI(ulid() + "-" + body.slug);
      input.image = process.env.NEXT_PUBLIC_S3_DOMAIN + "/" + filename;
      await uploadFile(filename, image);
    }

    const blog = await Blog.update(input);
    if (!blog)
      throw new HTTPException(400, { message: "Failed to create blog" });

    const customDomainRecord = await OrganizationDomain.findUnique(
      blog.organizationId,
    );

    if (c.var.blog.slug !== blog.slug) {
      try {
        revalidatePath(`/${c.var.organization.slug}/${blog.slug}/page`, "page");

        if (customDomainRecord)
          revalidatePath(
            `/${customDomainRecord.domain}/${blog.slug}/page`,
            "page",
          );

        await invalidateCloudFrontPaths(
          [
            `/${c.var.organization.slug}/${blog.slug}`,
            customDomainRecord?.domain ?? null,
          ].filter((r) => r !== null),
        );
      } catch (e) {
        console.error(e);
      }
    }

    return c.json(blog);
  },
);
