import streamingWrapper from "@opennextjs/aws/overrides/wrappers/aws-lambda.js";
import { validateSessionToken } from "auth/session";

declare global {
  const validateSession: typeof validateSessionToken;
}

(
  globalThis as unknown as {
    validateSession: typeof validateSessionToken;
  }
).validateSession = async (token: string) => {
  return await validateSessionToken(token);
};

export default streamingWrapper;
