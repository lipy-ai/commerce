// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var app_config_default = defineConfig({
  tsr: {
    appDirectory: "src",
  },
  server: {
    routeRules: {
      //   "/api/auth/*": {
      //     proxy: { to: "http://localhost:8080" },
      //   },
      "/api/**": {
        proxy: { to: "http://localhost:8080/api/**" },
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      //   visualizer(), // Generates a visual report
    ],
    //  test: {
    //    globals: true,
    //    environment: "jsdom",
    //  },
    resolve: {
      alias: [
        {
          find: "@lipy/web-ui",
          replacement: path.resolve(__dirname, "../../packages/web-ui/src"),
        },
        {
          find: "@envClient",
          replacement: path.resolve(__dirname, "../../env.client.ts"),
        },
        {
          find: "@lipy/lib",
          replacement: path.resolve(__dirname, "../../packages/lib/src"),
        },
        {
          find: "@lipy/server",
          replacement: path.resolve(__dirname, "../server/src"),
        },
        {
          find: "@",
          replacement: path.resolve(__dirname, "./src"),
        },
      ],
    },
  },
});
export { app_config_default as default };
