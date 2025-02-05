/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "plobbo",
      removal: input.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input.stage),
      home: "aws",
      providers: {
        aws: { region: "us-east-1" },
      },
    };
  },
  async run() {
    const { vpc } = await import("./infra/vpc");
    const [{}, { postgres }] = await Promise.all([
      import("./infra/email"),
      import("./infra/storage"),
    ]);

    await import("./infra/app");
    await import("./infra/command");

    (await import("./infra/migration")).buildAndRunMigrator(vpc, postgres);
  },
  console: {
    autodeploy: {
      target(event) {
        if (
          event.type === "branch" &&
          event.branch === "main" &&
          event.action === "pushed"
        ) {
          return { stage: "production" };
        }
      },
    },
  },
});
