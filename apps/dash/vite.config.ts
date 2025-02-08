import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    TanStackRouterVite({
      generatedRouteTree: "./src/route-tree.gen.ts",
      routesDirectory: "./src/routes",
    }),
    react(),
  ],
});
