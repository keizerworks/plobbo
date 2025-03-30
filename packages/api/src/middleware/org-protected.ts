import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Organization } from "@plobbo/db/organization/index";
import type { OrganizationMember } from "@plobbo/db/organization/member";
import type { User } from "@plobbo/db/user/index";
import { and, db, eq, getTableColumns, sql } from "@plobbo/db";
import {
  OrganizationMemberTable,
  OrganizationTable,
} from "@plobbo/db/organization/organization.sql";

interface Env {
  Variables: {
    user: User.Model;
    organization: Organization.Model & {
      member: OrganizationMember.Model;
    };
  };
}

export const enforeHasOrgMiddleware = (
  type: "param" | "id" | "organizationId",
) =>
  createMiddleware<Env>(async (c, next) => {
    const user = c.var.user;

    const parsedBody =
      c.req.method.toLowerCase() !== "get" ? await c.req.parseBody() : {};
    console.log(parsedBody);

    const id =
      type === "param"
        ? c.req.param("id")
        : type === "id"
          ? parsedBody.id
          : parsedBody.organizationId;

    if (typeof id !== "string") {
      throw new HTTPException(400, {
        message: "organizationId is required in request body",
      });
    }

    let organization;
    try {
      organization = (
        await db
          .select({
            ...getTableColumns(OrganizationTable),
            member: sql<OrganizationMember.Model>`(
              SELECT to_json(obj)
              FROM (
                SELECT *
                FROM ${OrganizationMemberTable}
                WHERE ${OrganizationMemberTable.organizationId} = ${OrganizationTable.id}
              ) AS obj
            )`.as("member"),
          })
          .from(OrganizationTable)
          .innerJoin(
            OrganizationMemberTable,
            eq(OrganizationTable.id, OrganizationMemberTable.organizationId),
          )
          .where(
            and(
              eq(OrganizationTable.id, id),
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

    if (!organization) {
      throw new HTTPException(403, {
        message: "You are not a member of this organization",
      });
    }

    c.set("organization", organization);
    await next();
  });
