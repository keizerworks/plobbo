import { vpc } from "./vpc";

export const valkey = new sst.aws.Redis("valkey", {
  engine: "valkey",
  dev: { host: "localhost", port: 6379 },
  vpc,
});
