import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";

import { Organization } from "~/db/organization";
import { getSignedUrlPutObject } from "~/storage";
import { protectedOrgProcedure } from "~/trpc";
import { updateOrganizationMutationSchema } from "~/validators/organization/update";

interface UpdateResponse {
    organization?: Organization.Model;
    logoUploadUrl?: string;
}

export const organizationUpdateHandler = protectedOrgProcedure
    .input(updateOrganizationMutationSchema)
    .mutation(async ({ input, ctx }): Promise<UpdateResponse> => {
        try {
            let logoUploadUrl;

            const { updateLogo, ...destructeredInput } = input;
            const values: Organization.UpdateInput = destructeredInput;

            if (updateLogo) {
                const filename = encodeURI(`${createId()}-${input.slug}`);
                const logoUrl = `${filename}`;
                logoUploadUrl = await getSignedUrlPutObject({ filename });
                values.logo = logoUrl;
            }

            const organization = await Organization.update(
                ctx.member.organizationId,
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
