import { D1 } from "../.sst/platform/src/components/cloudflare";
import { D1_DATABASE_ID } from "./storage";

export const drizzleStudio = new sst.x.DevCommand("drizzle-studio", {
  link: [D1],
  environment: { D1_DATABASE_ID },
  dev: {
    autostart: false,
    command: "pnpm dlx drizzle-kit studio",
  },
});

// export const drizzleMigration = new sst.x.DevCommand("drizzle-studio", {
//   link: [D1],
//   environment: { D1_DATABASE_ID },
//   dev: {
//     autostart: false,
//     command: "pnpm dlx drizzle-kit push",
//   },
// });
