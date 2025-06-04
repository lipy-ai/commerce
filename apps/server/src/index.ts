import { app } from "./app";
import env from "./env";
import { logger } from "./lib/logger";
const port = env.PORT;
// eslint-disable-next-line no-console

logger.info(`✅ Server is running on port http://localhost:${port}`);

export default {
	fetch: app.fetch,
	port,
};
