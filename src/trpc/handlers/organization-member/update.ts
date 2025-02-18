import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";

import { OrganizationMember } from "~/db/organization/member";
import { getSignedUrlPutObject } from "~/storage";
import { protectedOrgProcedure } from "~/trpc";
import { updateUserProfileMutationSchema } from "~/validators/organization-member/update";

export const organizationMemberUpdateHandler = protectedOrgProcedure
    .input(updateUserProfileMutationSchema)
    .mutation(async ({ input, ctx }) => {
        try {
            let profilePictureUploadUrl;

            const { updateProfilePicture, ...destructeredInput } = input;
            const values: OrganizationMember.UpdateInput = {
                ...destructeredInput,
                id: ctx.member.id,
            };

            if (updateProfilePicture) {
                const filename = encodeURI(
                    `${createId()}-${input.displayName}`,
                );
                const profilePictureUrl = `${filename}`;
                profilePictureUploadUrl = await getSignedUrlPutObject({
                    filename,
                });
                values.profilePicture = profilePictureUrl;
            }

            const member = await OrganizationMember.update(values);
            return { member, profilePictureUploadUrl };
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to update organization member",
                cause: error,
            });
        }
    });
