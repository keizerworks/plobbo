import { domain } from "./dns";

export const email = new sst.aws.Email("email", {
  sender: domain,
  dns: sst.cloudflare.dns(),
});
