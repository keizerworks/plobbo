export const vpc = new sst.aws.Vpc(
  "vpc",
  $app.stage === "production" ? { nat: "ec2" } : undefined,
);
