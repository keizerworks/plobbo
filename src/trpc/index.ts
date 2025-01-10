import { initTRPC, TRPCError } from "@trpc/server";
import { getCurrentSession } from "auth/session";
import { db } from "db";
import {
  OrganizationMemberTable,
  OrganizationTable,
} from "db/schema/organization";
import { and, eq } from "drizzle-orm";
import superjson from "superjson";
import { inputWithOrgId } from "validators/trpc/plugins/enforce-user-org";
import { ZodError } from "zod";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { user } = await getCurrentSession();
  return { ...opts, user, db };
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  const user = ctx.user;
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({ ctx: { user } });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed);

// plugins
const enforceUserHasOrgAccess = protectedProcedure
  .input(inputWithOrgId)
  .use(async ({ ctx, input, next }) => {
    const [orgMembership] = await ctx.db
      .select({
        organization: OrganizationTable,
        member: OrganizationMemberTable,
      })
      .from(OrganizationMemberTable)
      .innerJoin(
        OrganizationTable,
        eq(OrganizationMemberTable.organizationId, OrganizationTable.id),
      )
      .where(
        and(
          eq(OrganizationMemberTable.userId, ctx.user.id),
          eq(OrganizationTable.id, input.orgId),
        ),
      )
      .limit(1);

    if (!orgMembership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this organization",
      });
    }

    return next({
      ctx: {
        user: ctx.user,
        orgMembership,
      },
    });
  });

export const protectedOrgProcedure = protectedProcedure.unstable_concat(
  enforceUserHasOrgAccess,
);
