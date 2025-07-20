import type { DBTypes } from "@lipy/server/db";

export function formatAddress(address: DBTypes["address"]) {
	const {
		name,
		// tag,
		line1,
		line2,
		city,
		state,
		postalCode,
		country,
	} = address;

	const parts = [
		name,
		line1,
		line2,
		city,
		state,
		country,
		postalCode ? `- ${postalCode}` : null,
	];

	return parts
		.filter((part) => part && part.toString().trim() !== "")
		.join("\n");
}
