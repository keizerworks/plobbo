import { z } from "zod";

export const updateUserProfileSchema = z.object({
  display_name: z.string().min(2),
  bio: z.string().min(2).optional(),
  profile_picture: z.instanceof(File).optional(),
});

export const updateUserProfileMutationSchema = updateUserProfileSchema
  .omit({ profile_picture: true })
  .extend({ update_profile_picture: z.boolean().default(false) });

export type UpdateUserProfileInterface = z.infer<
  typeof updateUserProfileSchema
>;
