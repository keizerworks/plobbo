import { TRPCError } from "@trpc/server";
import { generateRandomOTP } from "auth/code";
import { hashPassword } from "auth/password";
import {
  createEmailVerificationRequest,
  deletedEmailVerificationRequestByEmail,
} from "db/actions/email-verification";
import { createUser, deleteUser, getUserByEmail } from "db/actions/user";
import { env } from "env";
import transporter from "mailer";
import { getVerifyHtml } from "mailer/templates/auth/verify-email";
import { publicProcedure } from "trpc";
import { signUpSchema } from "validators/auth";

export const signUpHanlder = publicProcedure
  .input(signUpSchema)
  .mutation(async ({ input: body }) => {
    let user = await getUserByEmail(body.email);
    if (user?.emailVerified)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "A user with this email address is already registered and verified. Please sign in instead.",
      });

    const passwordHash = await hashPassword(body.password);
    if (user?.id) await deleteUser(user.id);
    user = await createUser({
      email: body.email,
      name: body.name,
      emailVerified: false,
      passwordHash,
    });

    const otp = generateRandomOTP();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await deletedEmailVerificationRequestByEmail(body.email);
    await createEmailVerificationRequest({
      email: body.email,
      expiresAt,
      userId: user.id,
      otp,
    });

    await transporter
      .sendMail({
        from: env.EMAIL_FROM,
        to: body.email,
        html: await getVerifyHtml({ validationCode: otp }),
      })
      .catch(console.error);

    return {
      message:
        "A verification OTP has been sent to your email address. Please verify your email to complete the signup process.",
    };
  });
