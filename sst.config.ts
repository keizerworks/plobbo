/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: "plobbo",
            removal: input?.stage === "production" ? "retain" : "remove",
            protect: ["production"].includes(input?.stage),
            home: input.stage === "production" ? "cloudflare" : "local",
            providers: { cloudflare: true, aws: { region: "us-east-1" } },
        };
    },
    async run() {
        await import("./infra/storage");
        await import("./infra/email");
        await import("./infra/secrets");
        await import("./infra/workers");
        await import("./infra/dash");
        await import("./infra/commands");
    },
});
