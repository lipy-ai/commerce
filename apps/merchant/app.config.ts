import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// import visualizer from "rollup-plugin-visualizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  tsr: {
    appDirectory: "src",
  },
  server: {
    // preset: "node",

    routeRules: {
      "/api/**": {
        proxy: {
          to: process.env.VITE_API_URL + "/api/**",
          headers: {
            "Content-Type": "application/json",
          },
        },
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
