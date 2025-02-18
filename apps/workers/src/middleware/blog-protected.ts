/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Subjects } from "@plobbo/auth/subjects";
import type { Drizzle } from "@plobbo/core/db/drizzle";
import { BlogTable } from "@plobbo/core/db/blog/blog.sql";
import { Blog } from "@plobbo/core/db/blog/index";
import { and, eq, getDrizzle } from "@plobbo/core/db/drizzle";
import {
    OrganizationMemberTable,
    OrganizationTable,
} from "@plobbo/core/db/organization/organization.sql";

interface Env {
    Variables: {
        user: Subjects;
        db: Drizzle;
        blog: Blog.Model;
    };
}

export const enforeHasBlogMiddleware = createMiddleware<Env>(
    async (c, next) => {
        const user = c.var.user;
        const blogId = c.req.param("id")!;

        const db = getDrizzle();

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
                        eq(
                            OrganizationMemberTable.organizationId,
                            OrganizationTable.id,
                        ),
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
        c.set("db", db);

        await next();
    },
);
