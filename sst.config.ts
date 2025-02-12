/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "plobbo",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
      providers: { cloudflare: true, aws: { region: "us-east-1" } },
    };
  },
  async run() {
    await Promise.all([
      import("./infra/storage"),
      import("./infra/workers"),
      import("./infra/email"),
      import("./infra/dash"),
      import("./infra/commands"),
    ]);
  },
});
