import { D1, D1_DATABASE_ID } from "./storage";

export const drizzleStudio = new sst.x.DevCommand("drizzlestudio", {
    link: [D1],
    environment: { D1_DATABASE_ID },
    dev: {
        autostart: false,
        command: "pnpm dlx drizzle-kit studio",
    },
});
