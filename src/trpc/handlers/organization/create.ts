import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { insertOrganization } from "repository/organization";
import { insertOrganizationMember } from "repository/organization-member";
import { getSignedUrlPutObject } from "storage";
import { protectedProcedure } from "trpc";
import { createOrganizationMutationSchema } from "validators/organization/create";

export const organizationCreateHandler = protectedProcedure
  .input(createOrganizationMutationSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const filename = encodeURI(`${createId()}-${input.slug}`);
      const logoUrl = `organizations/${filename}`;

      // Create organization
      const organization = await insertOrganization({
        name: input.name,
        slug: input.slug,
        logo: logoUrl,
      });

      // Create organization member (current user as admin)
      await insertOrganizationMember({
        user_id: ctx.user.id,
        organization_id: organization.id,
        role: "ADMIN",
        display_name: ctx.user.name,
      });

      const logoUploadUrl = await getSignedUrlPutObject({
        bucket: "organizations",
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
