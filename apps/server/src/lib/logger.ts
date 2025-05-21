import pino from "pino";
import env from "../env";

const logger = pino({
	level: env?.LOG_LEVEL || "info",
	transport: !env?.IN_PROD
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
					levelFirst: true,
					translateTime: "HH:MM:ss",
				},
			}
		: undefined,
});
export { logger };
