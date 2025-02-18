import { DATABASE_URL } from "./storage";

export function buildAndRunMigrator(vpc: sst.aws.Vpc, rds: sst.aws.Postgres) {
    // Invoke the migrator every deploy
    // drizzle handles the migration
    if (!$dev) {
        const migrator = new sst.aws.Function(
            "migrator-pg",
            {
                handler: "migrator.handler",
                timeout: "300 seconds",
                link: [rds],
                vpc: $app.stage === "production" ? vpc : undefined,
                copyFiles: [{ from: "migrations", to: "migrations" }],
                environment: { DATABASE_URL },
                runtime: "nodejs22.x",
            },
            { dependsOn: [vpc, rds] },
        );

        new aws.lambda.Invocation("MigratorInvocation", {
            functionName: migrator.name,
            input: JSON.stringify({ now: new Date().toISOString() }),
        });
    }
}
