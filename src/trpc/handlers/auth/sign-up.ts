import { TRPCError } from "@trpc/server";
import { generateRandomOTP } from "auth/code";
import { hashPassword } from "auth/password";
import { env } from "env";
import transporter from "mailer";
import { getVerifyHtml } from "mailer/templates/auth/verify-email";
import {
  createEmailVerificationRequest,
  deleteEmailVerificationRequestByEmail,
} from "repository/email-verification";
import { deleteUser, getUserByEmail, insertUser } from "repository/user";
import { publicProcedure } from "trpc";
import { signUpSchema } from "validators/auth";

export const signUpHanlder = publicProcedure
  .input(signUpSchema)
  .mutation(async ({ input: body }) => {
    try {
      let user = await getUserByEmail(body.email);

      if (user?.email_verified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "A user with this email address is already registered and verified. Please sign in instead.",
        });
      }

      const passwordHash = await hashPassword(body.password);
      if (user?.id) await deleteUser(user.id);
      user = await insertUser({
        email: body.email,
        name: body.name,
        email_verified: false,
        password_hash: passwordHash,
      });

      const otp = generateRandomOTP();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

      await deleteEmailVerificationRequestByEmail(body.email);
      createEmailVerificationRequest({
        email: body.email,
        expires_at: expiresAt,
        user_id: user.id,
        otp,
      }).catch(console.error);

      transporter
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
    } catch (e) {
      console.log(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });
