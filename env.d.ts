/// <reference types="astro/client" />
declare namespace App {
  // Note: 'import {} from ""' syntax does not work in .d.ts files.
  interface Locals {
    session: import("./src/db/schema/session").SessionInterface | null;
    user: import("./src/db/schema/user").UserInterface | null;
    emailVerificationRequest:
      | import("./src/db/schema/email-verification").EmailVerificationRequestInterface
      | null;
  }
}
