// @ts-check
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: true }), react()],
  adapter: node({ mode: "standalone" }),
  output: 'server',
  env: {
    schema: {
      // server
      DB_FILE_NAME: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),

      SMTP_HOST: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),

      SMTP_PORT: envField.number({
        context: "server",
        access: "secret",
        optional: false,
      }),

      SMTP_USER: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),

      SMTP_PASSWORD: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),

      EMAIL_FROM: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
  },
});
