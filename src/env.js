import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_ENV: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // langdb
    LANGDB_OPENAI_BASE_URL: z.string().url(),
    LANGDB_PROJECT_ID: z.string().uuid(),
    LANGDB_API_KEY: z.string(),
  },

  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_S3_DOMAIN: z.string().url().optional(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    APP_ENV: process.env.APP_ENV,
    NEXT_PUBLIC_S3_DOMAIN: process.env.NEXT_PUBLIC_S3_DOMAIN,
    LANGDB_OPENAI_BASE_URL: process.env.LANGDB_OPENAI_BASE_URL,
    LANGDB_PROJECT_ID: process.env.LANGDB_PROJECT_ID,
    LANGDB_API_KEY: process.env.LANGDB_API_KEY,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
