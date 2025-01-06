// @ts-check
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: true }), react()],
  adapter: node({ mode: "standalone" }),
  vite: {
    ssr: {
      noExternal: ['katex', 'novel' , 'react-tweet']
    },
    optimizeDeps: {
      include: ['katex', 'novel']
    }
  },
  output: 'server',
  env: {
    schema: {
      // server
      DB_FILE_NAME: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
  },
});
