import { vpc } from "./vpc";

export const bucket = new sst.aws.Bucket("bucket", { access: "public" });
export const postgres = new sst.aws.Postgres("pg", {
  vpc,
  dev: {
    username: "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: "plobbo",
    host: "localhost",
    port: 5432,
  },
});

export const NEXT_PUBLIC_S3_DOMAIN = $interpolate`https://${bucket.domain}`;
export const DATABASE_URL = $interpolate`postgresql://${postgres.username}:${postgres.password}@${postgres.host}:${postgres.port}/${postgres.database}`;
