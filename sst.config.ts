// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "plobbo",
      removal: input.stage === "production" ? "retain" : "remove",
      protected: ["production"].includes(input.stage),
      home: "aws",
      providers: {
        aws: { region: "us-east-1" },
      },
    };
  },
  async run() {
    const { vpc } = await import("./infra/vpc");
    const [{ postgres }] = await Promise.all([
      import("./infra/storage"),
      import("./infra/email"),
    ]);

    (await import("./infra/migration")).buildAndRunMigrator(vpc, postgres);

    const { app } = await import("./infra/app");
    await import("./infra/command");

    return {
      www: app.url,
    };
  },
});
