import { EventEmitter } from "node:events";
import { logger } from "@/lib/logger";
// routes/sse.ts
import type { ServerContext } from "@/types";
import { Hono } from "hono";
import { type SSEStreamingApi, streamSSE } from "hono/streaming";

const emitter = new EventEmitter();
const connections = new Map<string, Set<SSEStreamingApi>>();

function addConnection(userId: string, stream: SSEStreamingApi) {
	if (!connections.has(userId)) {
		connections.set(userId, new Set());
	}

	connections.get(userId)!.add(stream);
}

function removeConnection(userId: string, stream: SSEStreamingApi) {
	const userStreams = connections.get(userId);
	if (!userStreams) return;
	userStreams.delete(stream);
	if (userStreams.size === 0) {
		connections.delete(userId);
	}
}

function sendToUser(userId: string, payload: { event: string; data: string }) {
	const streams = connections.get(userId);
	console.log(streams);

	if (!streams) return;

	for (const stream of streams) {
		stream.writeSSE({
			data: payload.data,
			event: payload.event,
			id: String(Date.now()),
		});
	}
}

emitter.on("send-to-user", ({ userId, event, data }) => {
	sendToUser(userId, { event, data });
});
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const eventsRoute = new Hono<ServerContext>()
	.get("/", async (c) => {
		const sess = c.get("session");

		const userId = sess?.userId;
		if (!userId) return c.body(null, 401);

		return streamSSE(c, async (stream) => {
			addConnection(userId, stream);

			let connected = true;

			stream.onAbort(() => {
				connected = false;
				removeConnection(userId, stream);
				logger.warn("Connection aborted");
			});

			// Optional heartbeat every 30s
			while (connected) {
				console.time("hit");
				await stream.writeSSE({
					event: "ping",
					data: "",
					id: String(Date.now()),
				});
				await sleep(10_000);
				console.timeLog("hit");
			}
		});
	})
	.post((c) => {
		const sess = c.get("session");
		sendToUser(sess?.userId!, { event: "test:created", data: "null" });
		return c.json(true);
	});

export { eventsRoute, emitter as sseEmitter };
