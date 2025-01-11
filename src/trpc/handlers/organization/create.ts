import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { createOrganization } from "db/actions/organization";
import { createOrganizationMember } from "db/actions/organization-member";
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
      const organization = await createOrganization({
        name: input.name,
        slug: input.slug,
        logo: logoUrl,
      });

      // Create organization member (current user as admin)
      await createOrganizationMember({
        userId: ctx.user.id,
        organizationId: organization.id,
        role: "ADMIN",
        orgMetadata: { display_name: ctx.user.name },
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
