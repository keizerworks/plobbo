import { TRPCError } from "@trpc/server";
import { verifyPasswordHash } from "auth/password";
import { createSession, generateSessionToken } from "auth/session";
import { User } from "db/user";
import { publicProcedure } from "trpc";
import { signInWithEmailSchema } from "validators/auth";

export const signInWithEmailHandler = publicProcedure
  .input(signInWithEmailSchema)
  .mutation(async ({ input: body }) => {
    const user = await User.findByEmail(body.email);
    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No user found with the provided email address.",
      });
    }

    if (!user.emailVerified) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Email address is not verified. Please verify your email to proceed.",
      });
    }

    if (!user.passwordHash) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Password is not set for this account. Please reset your password.",
      });
    }

    const validPassword = await verifyPasswordHash(
      user.passwordHash,
      body.password,
    );

    if (!validPassword) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid email or password. Please try again.",
      });
    }

    const sessionToken = generateSessionToken();
    await createSession(sessionToken, user.id);
  });
