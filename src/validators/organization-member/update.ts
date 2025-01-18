import { z } from "zod";

export const updateUserProfileSchema = z.object({
  display_name: z.string().min(2),
  bio: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  profile_picture: z.instanceof(File).optional(),
});

export const updateUserProfileMutationSchema = z.object({
  display_name: z.string().min(2),
  bio: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  updateProfile_picture: z.boolean().default(false),
});

export type UpdateUserProfileInterface = z.infer<
  typeof updateUserProfileSchema
>;
