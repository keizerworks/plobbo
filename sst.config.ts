/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "keizer-blogs",
      removal: input.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input.stage),
      home: "aws",
      providers: {
        aws: { region: "us-east-1" },
      },
    };
  },
  async run() {
    await import("./infra/vpc");
    await Promise.all([import("./infra/email"), import("./infra/storage")]);
    await import("./infra/app");
    await import("./infra/command");
  },
  console: {
    autodeploy: {
      target(event) {
        if (
          event.type === "pull_request" &&
          event.base === "main" &&
          event.action === "pushed"
        ) {
          return { stage: "production" };
        }
      },
    },
  },
});
