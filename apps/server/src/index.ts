import { app } from "./app";
import env from "./env";
import { logger } from "./lib/logger";

const port = env.PORT;
const host = "0.0.0.0";
// eslint-disable-next-line no-console

logger.info(`✅ Server is running on http://${host}:${port}`);

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
  hostname: host,
};
