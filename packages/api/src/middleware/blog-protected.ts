/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { User } from "@plobbo/db/user/index";
import { and, db, eq } from "@plobbo/db";
import { BlogTable } from "@plobbo/db/blog/blog.sql";
import { Blog } from "@plobbo/db/blog/index";
import { Organization } from "@plobbo/db/organization/index";
import {
  OrganizationMemberTable,
  OrganizationTable,
} from "@plobbo/db/organization/organization.sql";

interface Env {
  Variables: {
    user: User.Model;
    blog: Blog.Model;
    organization: Organization.Model;
  };
}

export const enforeHasBlogMiddleware = createMiddleware<Env>(
  async (c, next) => {
    const user = c.var.user;
    const blogId = c.req.param("id")!;

    let record;
    try {
      record = (
        await db
          .select({ blog: Blog.columns, organization: Organization.columns })
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

    if (!record) {
      throw new HTTPException(403, {
        message: "You are not a member of this organization",
      });
    }

    c.set("blog", record.blog);
    c.set("organization", record.organization);
    await next();
  },
);
