import { signInWithEmailHandler } from "trpc/handlers/auth/sign-in/email";
import { signUpHanlder } from "trpc/handlers/auth/sign-up";
import { verifyEmailHandler } from "trpc/handlers/auth/verify-email";

export const authRouter = {
  signUp: signUpHanlder,
  verifyEmail: verifyEmailHandler,
  signInWithEmail: signInWithEmailHandler,
};
