import { createClient } from "@openauthjs/openauth/client";
import { Resource } from "sst/resource";

export const getClient = () =>
  createClient({
    clientID: "workers",
    issuer: Resource.auth.url,
  });
