import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  tsr: {
    appDirectory: "src",
  },
  vite: {
    plugins: [
      tailwindcss(),
      // tsConfigPaths({
      //   projects: ["./tsconfig.json"],
      // }),
    ],
    resolve: {
      alias: [
        {
          find: "@web-ui",
          replacement: path.resolve(__dirname, "../../packages/web-ui/src"),
        },
        {
          find: "@",
          replacement: path.resolve(__dirname, "./src"),
        },
      ],
    },
  },
});
