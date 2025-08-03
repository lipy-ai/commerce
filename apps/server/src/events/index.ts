import { defineHandlers } from "@hono/event-emitter";
import type { DBTypes } from "@/db";
import { discordNotification } from "@/notification/discord";

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
		(_c, payload) => {
			discordNotification({
				type: "order:created",
				payload: payload,
			});
		}, // c is current Context, payload will be correctly inferred as Order
	],
	"store:created": [
		(_c, payload) => {
			discordNotification({
				type: "store:created",
				payload: payload,
			});
		},
	],
	"store:deleted": [
		async (_c, _payload) => {}, // c is current Context, payload will be inferred as string
	],
});
