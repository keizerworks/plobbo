import { domain } from "./dns";

export const email = new sst.aws.Email("ses", {
  sender: domain,
  dns: sst.cloudflare.dns(),
});
