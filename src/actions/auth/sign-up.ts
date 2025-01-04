import {
  createEmailVerificationRequest,
  deletedEmailVerificationRequestByEmail,
} from "@/db/actions/email-verification";
import { createUser, deleteUser, getUserByEmail } from "@/db/actions/user";
import { generateRandomOTP } from "@/lib/auth/code";
import { hashPassword } from "@/lib/auth/password";
import transporter from "@/mailer";
import { getVerifyHtml } from "@/mailer/auth/verify-email";
import { signUpSchema } from "@/validators/auth/signup";
import { ActionError, defineAction } from "astro:actions";
import { EMAIL_FROM } from "astro:env/server";

export const signUp = defineAction({
  input: signUpSchema,
  handler: async (input) => {
    const { firstName, lastName, email, password } = input;
    let user = await getUserByEmail(email);

    if (user?.emailVerified) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message:
          "A user with this email address is already registered and verified. Please sign in instead.",
      });
    }

    const passwordHash = await hashPassword(password);
    if (user?.id) await deleteUser(user.id);
    user = await createUser({
      email,
      firstName,
      lastName,
      emailVerified: false,
      passwordHash,
    });

    const otp = generateRandomOTP();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
    await deletedEmailVerificationRequestByEmail(email);
    await createEmailVerificationRequest({
      email,
      expiresAt,
      userId: user.id,
      otp,
    });

    transporter
      .sendMail({
        to: email,
        html: await getVerifyHtml({ validationCode: otp }),
        from: EMAIL_FROM,
      })
      .catch(console.error);

    return {
      message:
        "A verification OTP has been sent to your email address. Please verify your email to complete the signup process.",
    };
  },
});
