import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig((config) => ({
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      { find: "containers", replacement: "/src/containers" },
      { find: "components", replacement: "/src/components" },
      { find: "config", replacement: "/src/config" },
      { find: "utils", replacement: "/src/utils" },
      { find: "store", replacement: "/src/store" },
      { find: "api", replacement: "/src/api" },
      { find: "types", replacement: "/src/types" },
      { find: "@images", replacement: "/public/svg" },
    ],
  },
  esbuild: {
    drop: config.mode === "production" ? ["console", "debugger"] : [],
  },
  build: {
    sourcemap: true,
  },
}));
