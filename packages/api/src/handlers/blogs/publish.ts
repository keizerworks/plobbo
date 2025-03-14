import { revalidateTag } from "next/cache";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { factory } from "@plobbo/api/factory";
import { invalidateCloudFrontPaths } from "@plobbo/api/lib/cloudfront";
import { enforeAuthMiddleware } from "@plobbo/api/middleware/auth";
import { enforeHasBlogMiddleware } from "@plobbo/api/middleware/blog-protected";
import { Blog } from "@plobbo/db/blog/index";
import { OrganizationDomain } from "@plobbo/db/organization/domain";

export const publishBlogHandler = factory.createHandlers(
  enforeAuthMiddleware,
  enforeHasBlogMiddleware,
  zValidator("param", z.object({ id: z.string() })),
  async (c) => {
    const id = c.req.valid("param").id;
    let blog = await Blog.findById(id);
    if (!blog) throw new HTTPException(404, { message: "Blog not found" });

    blog = await Blog.update({
      ...blog,
      status: "PUBLISHED",
      publishedBody: blog.body,
      publishedContent: blog.content,
      publishedDate: new Date(),
    });

    if (!blog) throw new HTTPException(404, { message: "Blog not found" });

    const customDomain = await OrganizationDomain.findUnique(
      blog.organizationId,
    );

    try {
      revalidateTag(blog.slug);
      await invalidateCloudFrontPaths(
        [
          "/blog/" + blog.slug,
          customDomain ? `/${customDomain.domain}/${blog.slug}` : null,
        ].filter((path) => typeof path === "string"),
      );
    } catch (e) {
      console.error(e);
    }
    return c.json(blog);
  },
);
