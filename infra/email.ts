import { domain } from "./dns";

export const email = new sst.aws.Email("plobbo-ses", {
  sender: domain,
  dns: sst.cloudflare.dns(),
});
