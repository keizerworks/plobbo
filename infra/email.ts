export const email = new sst.aws.Email("plobbo-ses", {
  sender: "plobbo.com",
  dns: sst.cloudflare.dns(),
});
