/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "plobbo",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        cloudflare: true,
        aws: { region: "us-east-1", profile: process.env.AWS_PROFILE },
      },
    };
  },
  async run() {
    const { vpc } = await import("./infra/vpc");
    const [{ postgres }] = await Promise.all([
      import("./infra/storage"),
      import("./infra/email"),
      await import("./infra/secrets"),
    ]);
    (await import("./infra/migrator")).buildAndRunMigrator(vpc, postgres);
    const [{ www }, { dashboard }, { auth }] = await Promise.all([
      import("./infra/www"),
      import("./infra/dash"),
      import("./infra/auth"),
    ]);

    await import("./infra/commands");

    return {
      www: www.url,
      dashboard: dashboard.url,
      auth: auth.url,
    };
  },
});
