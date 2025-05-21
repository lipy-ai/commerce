import { defineConfig } from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
	tsr: {
		appDirectory: "src",
	},
	server: {
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

			// VitePWA({
			//   // strategies: "injectManifest",
			//   // srcDir: "src",
			//   // filename: "service-worker.js",
			//   // registerType: "autoUpdate",
			//   // injectManifest: {
			//   //   injectionPoint: "self.__WB_MANIFEST",
			//   // },
			//   manifest: {
			//     name: "Your Vinxi App",
			//     short_name: "VinxiApp",
			//     theme_color: "#ffffff",
			//     icons: [
			//       // Add your icons here
			//     ],
			//   },
			// }),
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
