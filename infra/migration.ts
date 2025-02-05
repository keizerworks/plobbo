import { DATABASE_URL } from "./storage";

export function buildAndRunMigrator(vpc: sst.aws.Vpc, rds: sst.aws.Postgres) {
  const migrator = new sst.aws.Function(
    "plobbo-migrator-pg",
    {
      handler: "src/migrator.hanlder",
      timeout: "300 seconds",
      link: [rds],
      vpc: vpc,
      environment: {
        DATABASE_URL,
      },
    },
    {
      dependsOn: [vpc, rds],
    },
  );

  // Invoke the migrator every deploy  drizzle handles the migration
  if (!$dev) {
    new aws.lambda.Invocation("MigratorInvocation", {
      functionName: migrator.name,
      input: JSON.stringify({
        now: new Date().toISOString(),
      }),
    });
  }
}
