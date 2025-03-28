import { Polar } from "@polar-sh/sdk";
import { Resource } from "sst/resource";

export const polar = new Polar({
  accessToken: process.env.POLAR_API_TOKEN,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});
