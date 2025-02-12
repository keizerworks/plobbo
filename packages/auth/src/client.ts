import { createClient } from "@openauthjs/openauth/client";
import { Resource } from "sst/resource";

export const client = createClient({
  clientID: "jwt-api",
  issuer: Resource.auth.url,
});
