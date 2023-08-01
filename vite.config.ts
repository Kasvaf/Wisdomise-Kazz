import linaria from "@linaria/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig((config) => ({
  plugins: [
    react(),
    svgr(),
    linaria({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
  ],
  resolve: {
    alias: [
      { find: "containers", replacement: "/src/containers" },
      { find: "components", replacement: "/src/components" },
      { find: "config", replacement: "/src/config" },
      { find: "utils", replacement: "/src/utils" },
      { find: "store", replacement: "/src/store" },
      { find: "api", replacement: "/src/api" },
      { find: "types", replacement: "/src/types" },
      { find: "shared", replacement: "/src/shared" },
      { find: "pages", replacement: "/src/pages" },
      { find: "@images", replacement: "/src/assets/svg" },
    ],
  },
  esbuild: {
    drop: config.mode === "production" ? ["console", "debugger"] : [],
  },
  build: {
    sourcemap: true,
  },
}));
