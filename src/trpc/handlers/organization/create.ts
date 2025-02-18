import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";

import { Organization } from "~/db/organization";
import { OrganizationMember } from "~/db/organization/member";
import { getSignedUrlPutObject } from "~/storage";
import { protectedProcedure } from "~/trpc";

export const organizationCreateHandler = protectedProcedure
    .input(Organization.createSchema)
    .mutation(async ({ input, ctx }) => {
        try {
            const filename = encodeURI(`${createId()}-${input.slug}`);
            const logoUrl = `${filename}`;

            const organization = await Organization.create({
                name: input.name,
                slug: input.slug,
                logo: logoUrl,
            });

            if (!organization) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create organization",
                });
            }

            // Create organization member (current user as admin)
            await OrganizationMember.create({
                userId: ctx.user.id,
                organizationId: organization.id,
                role: "ADMIN",
                displayName: ctx.user.name,
            });

            const logoUploadUrl = await getSignedUrlPutObject({
                filename,
            });

            return { organization, logoUploadUrl };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create organization",
                cause: error,
            });
        }
    });
