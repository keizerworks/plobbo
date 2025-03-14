import { DATABASE_URL } from "./storage";
import { www } from "./www";

export function buildAndRunMigrator(vpc: sst.aws.Vpc, rds: sst.aws.Postgres) {
  // Invoke the migrator every deploy
  // drizzle handles the migration
  if (!$dev) {
    const migrator = new sst.aws.Function(
      "migrator-pg",
      {
        handler: "packages/db/src/migrator.handler",
        timeout: "300 seconds",
        link: [rds],
        vpc: $app.stage === "production" ? vpc : undefined,
        copyFiles: [{ from: "packages/db/migrations", to: "migrations" }],
        environment: { DATABASE_URL },
        runtime: "nodejs22.x",
      },
      { dependsOn: [vpc, rds, www] },
    );

    new aws.lambda.Invocation("MigratorInvocation", {
      functionName: migrator.name,
      input: JSON.stringify({ now: new Date().toISOString() }),
    });
  }
}
