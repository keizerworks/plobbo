import { revalidatePath } from "next/cache";
import { zValidator } from "@hono/zod-validator";
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
    const { blog, organization } = c.var;

    await Blog.update({
      ...blog,
      status: "PUBLISHED",
      publishedBody: blog.body,
      publishedContent: blog.content,
      publishedDate: new Date(),
    });

    const customDomainRecord = await OrganizationDomain.findUnique(
      blog.organizationId,
    );

    try {
      revalidatePath(`/${organization.slug}/${blog.slug}/page`, "page");

      if (customDomainRecord)
        revalidatePath(
          `/${customDomainRecord.domain}/${blog.slug}/page`,
          "page",
        );

      await invalidateCloudFrontPaths(
        [
          `/${organization.slug}/${blog.slug}`,
          customDomainRecord?.domain ?? null,
        ].filter((r) => r !== null),
      );
    } catch (e) {
      console.error(e);
    }
    return c.json(blog);
  },
);
