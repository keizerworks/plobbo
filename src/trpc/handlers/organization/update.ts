import { TRPCError } from "@trpc/server";
import { updateOrganization } from "repository/organization";
import { protectedOrgProcedure } from "trpc";
import { updateOrganizationSchema } from "validators/organization/update";

export const organizationUpdateHandler = protectedOrgProcedure
  .input(updateOrganizationSchema)
  .mutation(async ({ input, ctx }) => {
    let updateOrg;
    let organization_id;
    try {
      const {...values} = input
      updateOrg = await updateOrganization(
        (organization_id = ctx.member.organization_id),
        values,
      );
      return { updateOrg, success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update organization",
        cause: error,
      });
    }
  });
