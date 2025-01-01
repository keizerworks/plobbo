import { z } from "astro/zod";
import { zfd } from "zod-form-data";

export const signUpSchema = zfd.formData({
  firstName: z.string().min(3),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((password) => /[A-Z]/.test(password), {
      message: "At least one uppercase letter is required",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "At least one lowercase letter is required",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "At least one digit is required",
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "At least one special character is required",
    }),
});

export type SignUpFormInteface = z.infer<typeof signUpSchema>;
