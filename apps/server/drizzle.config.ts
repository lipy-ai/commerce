// import env from "dotenv";
// env.config({ path: "../../.env" });
// console.log(process.env.DATABASE_URL);

import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",

	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
});
