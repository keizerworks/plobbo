import { TRPCError } from "@trpc/server";
import { generateRandomOTP } from "auth/code";
import { hashPassword } from "auth/password";
import { EmailVerificationRequest } from "db/email-verification";
import { User } from "db/user";
import { sendMail } from "mailer";
import { getVerifyHtml } from "mailer/templates/auth/verify-email";
import { publicProcedure } from "trpc";
import { signUpSchema } from "validators/auth";

export const signUpHanlder = publicProcedure
  .input(signUpSchema)
  .mutation(async ({ input: body }) => {
    try {
      let user = await User.findByEmail(body.email);

      if (user?.emailVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "A user with this email address is already registered and verified. Please sign in instead.",
        });
      }

      const passwordHash = await hashPassword(body.password);
      if (user?.id) await User.remove(user.id);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- INFO: user will be defined
      user = (await User.create({
        email: body.email,
        name: body.name,
        emailVerified: false,
        passwordHash: passwordHash,
      }))!;

      const otp = generateRandomOTP();

      await EmailVerificationRequest.removeByEmail(body.email);
      await EmailVerificationRequest.create({
        email: body.email,
        userId: user.id,
        otp,
      }).catch(console.error);

      sendMail({
        destination: { ToAddresses: [body.email] },
        subject: "Confirm your email address",
        template: await getVerifyHtml({ validationCode: otp }),
      }).catch(console.error);

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
