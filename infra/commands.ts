import { DATABASE_URL, postgres } from "./storage";

export const drizzleStudio = new sst.x.DevCommand("drizzle-studio", {
  link: [postgres],
  environment: { DATABASE_URL },
  dev: {
    autostart: false,
    command: "pnpm drizzle-kit studio -F db",
  },
});
