import type { InsertOrganizationInterface } from "repository/organization";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { updateOrganization } from "repository/organization";
import { getSignedUrlPutObject } from "storage";
import { protectedOrgProcedure } from "trpc";
import { updateOrganizationMutationSchema } from "validators/organization/update";

interface UpdateResponse {
  organization?: Awaited<ReturnType<typeof updateOrganization>>;
  logoUploadUrl?: string;
}

export const organizationUpdateHandler = protectedOrgProcedure
  .input(updateOrganizationMutationSchema)
  .mutation(async ({ input, ctx }): Promise<UpdateResponse> => {
    try {
      let logoUploadUrl;

      const { updateLogo, ...destructeredInput } = input;
      const values: Omit<
        Partial<InsertOrganizationInterface>,
        "id"
      > = destructeredInput;

      if (updateLogo) {
        const filename = encodeURI(`${createId()}-${input.slug}`);
        const logoUrl = `organizations/${filename}`;
        logoUploadUrl = await getSignedUrlPutObject({
          bucket: "organizations",
          filename,
        });
        values.logo = logoUrl;
      }

      const organization = await updateOrganization(
        ctx.member.organization_id,
        values,
      );

      return { organization, logoUploadUrl };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update organization",
        cause: error,
      });
    }
  });
