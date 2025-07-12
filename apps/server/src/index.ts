import { emitter } from "@hono/event-emitter";
import { app } from "./app";
import env from "./env";
import { handlers } from "./events";
import { logger } from "./lib/logger";

// app.use(emitter(handlers));

const port = env.PORT;
// eslint-disable-next-line no-console

logger.info(`✅ Server is running on port http://localhost:${port}`);

if (process.versions.bun) {
	// This code will only run when the file is executed with Bun
	console.log("Running on Bun");
} else {
	// This code will run when not on Bun (e.g., Node.js)
	console.log("Running on Node.js or other environment");
}

export default {
	idleTimeout: 30,
	fetch: (request: Request) => app.fetch(request),
	port,
};
