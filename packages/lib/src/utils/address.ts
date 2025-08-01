import type { DBTypes } from "@lipy/server/db";

export function formatAddress(address: DBTypes["address"]): string {
	const { name, line1, line2, city, state, postalCode, country } = address;

	const parts = [
		name?.trim(),
		line1?.trim(),
		line2?.trim(),
		[city, state]
			.filter(Boolean)
			.map((s) => s.trim())
			.join(", ") || null,
		country?.trim(),
		postalCode ? `${postalCode}` : null,
	];

	// Remove empty or whitespace-only entries
	const cleaned = parts.filter((part) => part && part !== "");

	return cleaned.join(", ");
}
