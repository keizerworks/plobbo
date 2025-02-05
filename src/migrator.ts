import { exec } from "child_process";
import { join } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runPrismaMigrations() {
  try {
    if (process.env.NODE_ENV === "production") {
      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is required for migrations");
      }

      join("/tmp", "prisma");
      const { stdout, stderr } = await execAsync(
        `node ./node_modules/.bin/prisma migrate --schema ${join(
          process.cwd(),
          "prisma/schema.prisma",
        )}`,
        {
          env: process.env,
          cwd: "/tmp", // Use /tmp as working directory
        },
      );

      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    }
  } catch (error) {
    console.error("Failed to run Prisma migrations:", error);
    throw error;
  }
}

export async function handler() {
  await runPrismaMigrations();
  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Migration Done" }),
  };
}
