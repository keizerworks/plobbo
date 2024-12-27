// @ts-check
import db from "@astrojs/db";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [db(), tailwind(), react()],
  adapter: node({ mode: "standalone" }),
});
