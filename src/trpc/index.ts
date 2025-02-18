import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getActiveOrg } from "~/actions/cookies/active-org";
import { getCurrentSession, logout } from "~/auth/session";
import { db } from "~/db";
import { OrganizationMember } from "~/db/organization/member";

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const session = await getCurrentSession();
    return { ...opts, user: session ? session.user : null, db };
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        console.log(error);
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
    const user = ctx.user;
    if (!user) {
        await logout();
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
const enforceUserHasOrgAccess = protectedProcedure.use(
    async ({ ctx, next }) => {
        const activeOrg = await getActiveOrg();
        if (!activeOrg) {
            throw new TRPCError({ code: "FORBIDDEN" });
        }

        const activeOrgId = (
            JSON.parse(activeOrg) as {
                state: { id: string; version: number };
            }
        ).state.id;

        const member = await OrganizationMember.findOne({
            organizationId: activeOrgId,
            userId: ctx.user.id,
        });

        if (typeof member === "undefined") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You are not a member of this organization",
            });
        }

        return next({
            ctx: {
                user: ctx.user,
                member,
            },
        });
    },
);

export const protectedOrgProcedure = protectedProcedure.unstable_concat(
    enforceUserHasOrgAccess,
);
