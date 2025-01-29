import { DATABASE_URL } from "./storage";

export const primsaCommand = new sst.x.DevCommand("Prisma", {
  environment: { DATABASE_URL },
  dev: {
    autostart: false,
    command: "npx prisma studio",
  },
});
