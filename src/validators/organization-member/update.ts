import { createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import { OrganizationMemberTable } from "~/db/organization/organization.sql";

export const updateUserProfileSchema = createUpdateSchema(
    OrganizationMemberTable,
    {
        displayName: (s) => s.min(2),
        bio: (s) => s.min(2).optional(),
    },
).extend({
    profilePicture: z.instanceof(File).optional(),
});

export const updateUserProfileMutationSchema = updateUserProfileSchema
    .omit({ profilePicture: true })
    .extend({ updateProfilePicture: z.boolean().default(false) });

export type UpdateUserProfileInterface = z.infer<
    typeof updateUserProfileSchema
>;
