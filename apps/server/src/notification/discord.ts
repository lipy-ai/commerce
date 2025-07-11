import env from "@/env";

type DiscordNotificationParams = {
	type: "order:created" | "error" | "store:created";
	payload?: any;
};

export const discordNotification = async (
	params: DiscordNotificationParams,
) => {
	let embed = {};

	switch (params.type) {
		case "order:created":
			embed = {
				title: "🛒 Order Placed",
				description: "An order has been placed!",
				color: 0x00ff00,
				fields: [
					{
						name: "Order ID",
						value: params.payload?.id || "Unknown",
					},
					{
						name: "Customer",
						value:
							params.payload?.customerDetails.email ||
							params.payload?.customerDetails.phone ||
							params.payload?.customerId ||
							"Unknown",
					},
					{
						name: "Store",
						value: params.payload?.storeId || "Unknown",
					},
					{
						name: "Total Bill",
						value: `₹ ${params.payload?.itemTotalAmount || 0}`,
					},
					{
						name: "Delivery Address",
						value: `${params.payload?.customerDetails.address.metadata?.building} ${params.payload?.customerDetails.address.line1}`,
					},
					{
						name: "Items",
						value: params.payload?.items
							.map((item: any) => `${item.quantity} x ${item.title}`)
							.join(", "),
					},
				],
				timestamp: new Date().toISOString(),
			};
			break;

		case "store:created":
			embed = {
				title: "🏪 Store Created",
				description: "A new store has been created!",
				color: 0x0000ff,
				fields: [
					{
						name: "Store ID",
						value: params.payload?.id || "Unknown",
					},
					{
						name: "Store Name",
						value: params.payload?.name || "Unknown",
					},
					{
						name: "Store handle",
						value: params.payload?.handle || "Unknown",
					},
					{
						name: "Store Email",
						value: params.payload?.email || "Unknown",
					},
					{
						name: "Store Phone",
						value: params.payload?.phone || "Unknown",
					},
				],
				timestamp: new Date().toISOString(),
			};
			break;

		// case "error":
		// 	embed = {
		// 		title: "⚠️ Error",
		// 		description: "An error has occurred!",
		// 		color: 0xff0000,
		// 		fields: params.fields,
		// 		timestamp: new Date().toISOString(),
		// 	};
		// 	break;

		// case "storeCreated":
		// 	embed = {
		// 		title: "🏪 Store Created",
		// 		description: "A new store has been created!",
		// 		color: 0x0000ff,
		// 		fields: params.fields,
		// 		timestamp: new Date().toISOString(),
		// 	};
		// 	break;

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
