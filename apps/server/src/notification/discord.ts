import env from "@/env";

type DiscordNotificationParams = {
	type: "orderPlaced" | "error" | "storeCreated";
	fields: Array<{
		name: string;
		value: string;
	}>;
};

export const discordNotification = async (
	params: DiscordNotificationParams,
) => {
	let embed = {};

	switch (params.type) {
		case "orderPlaced":
			embed = {
				title: "🛒 Order Placed",
				description: "An order has been placed!",
				color: 0x00ff00,
				fields: params.fields,
				timestamp: new Date().toISOString(),
			};
			break;

		case "error":
			embed = {
				title: "⚠️ Error",
				description: "An error has occurred!",
				color: 0xff0000,
				fields: params.fields,
				timestamp: new Date().toISOString(),
			};
			break;

		case "storeCreated":
			embed = {
				title: "🏪 Store Created",
				description: "A new store has been created!",
				color: 0x0000ff,
				fields: params.fields,
				timestamp: new Date().toISOString(),
			};
			break;

		default:
			throw new Error(`Unknown notification type: ${params.type}`);
	}

	const response = await fetch(env.DISCORD_WEBHOOK, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			embeds: [embed],
		}),
	});

	return response;
};
