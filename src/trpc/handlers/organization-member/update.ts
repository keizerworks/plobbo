import type { InsertOrganizationMemberInterface } from "repository/organization-member";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { updateOrganizationMember } from "repository/organization-member";
import { getSignedUrlPutObject } from "storage";
import { protectedOrgProcedure } from "trpc";
import { updateUserProfileMutationSchema } from "validators/organization-member/update";

interface UpdateResponse {
  member?: Awaited<ReturnType<typeof updateOrganizationMember>>;
  profilePictureUploadUrl?: string;
}

export const organizationMemberUpdateHandler = protectedOrgProcedure
  .input(updateUserProfileMutationSchema)
  .mutation(async ({ input, ctx }): Promise<UpdateResponse> => {
    try {
      let profilePictureUploadUrl;

      const { updateProfile_picture, ...destructeredInput } = input;
      const values: Partial<InsertOrganizationMemberInterface> =
        destructeredInput;

      if (updateProfile_picture) {
        const filename = encodeURI(`${createId()}-${input.display_name}`);
        const profilePictureUrl = `organizations/${filename}`;
        profilePictureUploadUrl = await getSignedUrlPutObject({
          bucket: "organizations",
          filename,
        });
        values.profile_picture = profilePictureUrl;
      }

      const member = await updateOrganizationMember(ctx.member.id, values);

      return { member, profilePictureUploadUrl };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update organization member",
        cause: error,
      });
    }
  });
