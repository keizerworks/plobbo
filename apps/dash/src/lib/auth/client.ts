import { createClient } from "@openauthjs/openauth/client";

export const client = createClient({
  clientID: "dash",
  issuer: import.meta.env.VITE_AUTH_URL,
});
