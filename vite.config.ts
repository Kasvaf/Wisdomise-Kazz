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
      { find: "config", replacement: "/src/config" },
      { find: "utils", replacement: "/src/utils" },
      { find: "api", replacement: "/src/api" },
      { find: "old-api", replacement: "/src/old-api" },
      { find: "modules", replacement: "/src/modules" },
      { find: "shared", replacement: "/src/modules/shared" },
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
