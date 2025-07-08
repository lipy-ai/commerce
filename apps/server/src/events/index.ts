import type { DBTypes } from "@/db";
import { defineHandlers } from "@hono/event-emitter";

export type AvailableEvents = {
	"user:created": Pick<DBTypes["user"], "id">;
	"user:deleted": Pick<DBTypes["user"], "id">;
	"store:created": Pick<DBTypes["store"], "id">;
	"store:deleted": Pick<DBTypes["store"], "id">;
	"order:created": Pick<DBTypes["orders"], "id">;
	"order:updates": Pick<DBTypes["orders"], "id">;
};

// Define event handlers
export const handlers = defineHandlers<AvailableEvents>({
	"order:created": [
		(c, payload) => {
			console.log("event", payload);
		}, // c is current Context, payload will be correctly inferred as User
	],
	"store:deleted": [
		async (c, payload) => {}, // c is current Context, payload will be inferred as string
	],
});
