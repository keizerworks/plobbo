/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Subjects } from "@plobbo/auth/subjects";
import { and, db, eq } from "@plobbo/db";
import { BlogTable } from "@plobbo/db/blog/blog.sql";
import { Blog } from "@plobbo/db/blog/index";
import {
  OrganizationMemberTable,
  OrganizationTable,
} from "@plobbo/db/organization/organization.sql";

interface Env {
  Variables: {
    user: Subjects;
    blog: Blog.Model;
  };
}

export const enforeHasBlogMiddleware = createMiddleware<Env>(
  async (c, next) => {
    const user = c.var.user;
    const blogId = c.req.param("id")!;

    let blog;
    try {
      blog = (
        await db
          .select(Blog.columns)
          .from(BlogTable)
          .innerJoin(
            OrganizationTable,
            eq(OrganizationTable.id, BlogTable.organizationId),
          )
          .innerJoin(
            OrganizationMemberTable,
            eq(OrganizationMemberTable.organizationId, OrganizationTable.id),
          )
          .where(
            and(
              eq(BlogTable.id, blogId),
              eq(OrganizationMemberTable.userId, user.id),
            ),
          )
      )[0];
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Something went wrong!",
      });
    }

    if (!blog) {
      throw new HTTPException(403, {
        message: "You are not a member of this organization",
      });
    }

    c.set("blog", blog);
    await next();
  },
);
