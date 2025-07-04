import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: [tailwindcss(), tanstackStart() as any],
	build: {
		minify: true,
		sourcemap: process.env.NODE_ENV === "development",
	},

	server: {
		port: 3000,
		proxy: {
			"/api/**": {
				target: `${process.env.VITE_API_URL}/api/**`,
			},
		},
		allowedHosts: true,
	},
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
});
