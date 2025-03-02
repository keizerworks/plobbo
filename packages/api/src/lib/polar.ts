import { Polar } from "@polar-sh/sdk";
import { Resource } from "sst/resource";

export const polar = new Polar({
  accessToken: Resource.PolarAPIToken.value,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});
