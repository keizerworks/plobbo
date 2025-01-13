import { TRPCError } from "@trpc/server";
import { getEmailVerificationRequestByEmail } from "repository/email-verification";
import { updateUser } from "repository/user";
import { publicProcedure } from "trpc";
import { verifyEmailSchema } from "validators/auth";

export const verifyEmailHandler = publicProcedure
  .input(verifyEmailSchema)
  .mutation(async ({ input: body }) => {
    let verificationRequest;

    try {
      verificationRequest = await getEmailVerificationRequestByEmail(
        body.email,
      );
    } catch {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "No verification request found for this email. Please sign up again.",
      });
    }

    if (Date.now() > verificationRequest.expires_at.getTime()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "The OTP has expired. Please request a new verification code.",
      });
    }

    await updateUser(verificationRequest.user_id, { email_verified: true });
    getEmailVerificationRequestByEmail(body.email).catch(console.error);

    return {
      message:
        "Your email has been successfully verified. You can now sign in.",
    };
  });
