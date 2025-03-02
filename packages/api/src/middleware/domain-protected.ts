import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import type { Subjects } from "@plobbo/auth/subjects";
import type { Organization } from "@plobbo/db/organization/index";
import type { OrganizationMember } from "@plobbo/db/organization/member";
import { and, db, eq, getTableColumns, sql } from "@plobbo/db";
import { OrganizationDomain } from "@plobbo/db/organization/domain";
import {
  OrganizationDomainTable,
  OrganizationMemberTable,
  OrganizationTable,
} from "@plobbo/db/organization/organization.sql";

interface Env {
  Variables: {
    user: Subjects;
    orgDomain: OrganizationDomain.Model;
  };
}

export const enforeHasDomainMiddleware = (
  type: "param" | "id" | "organizationId",
) =>
  createMiddleware<Env>(async (c, next) => {
    const user = c.var.user;

    const parsedBody =
      c.req.method.toLowerCase() !== "get" ? await c.req.parseBody() : {};

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

    let record;
    try {
      record = (
        await db
          .select(OrganizationDomain.columns)
          .from(OrganizationDomainTable)
          .innerJoin(
            OrganizationMemberTable,
            eq(OrganizationTable.id, OrganizationDomainTable.organizationId),
          )
          .where(
            and(
              eq(OrganizationDomainTable.organizationId, id),
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

    c.set("orgDomain", record);
    await next();
  });
