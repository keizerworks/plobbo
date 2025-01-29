export const email = new sst.aws.Email("plobbo-ses", {
  sender: String(process.env.SES_SENDER),
});
