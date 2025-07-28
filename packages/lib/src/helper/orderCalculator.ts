import type { SUM_TYPE } from "@lipy/server/db/schema";
export function orderCalculator({
	items,
	discounts,
	taxes,
}: {
	items: Array<{ price: number; maxPrice?: number; qty: number }>;
	discounts: Array<{ amount: number; sum: (typeof SUM_TYPE)[number] }>;
	taxes: Array<{ amount: number; sum: (typeof SUM_TYPE)[number] }>;
}) {
	const itemsTotal = items.reduce(
		(sum, item) => sum + item.price * item.qty,
		0,
	);
	const maxItemsTotal = items.reduce(
		(sum, item) => sum + (item.maxPrice ?? item.price) * item.qty,
		0,
	);

	let maxDiscountTotal = 0;
	let discountTotal = 0;
	let maxTaxTotal = 0;
	let taxTotal = 0;

	for (const t of taxes) {
		let maxAmount = Number(t.amount);
		let amount = Number(t.amount);
		if (t.sum === "percent") {
			amount = (itemsTotal * amount) / 100;
			maxAmount = (maxItemsTotal * maxAmount) / 100;
		}
		maxTaxTotal = maxTaxTotal + maxAmount;
		taxTotal = taxTotal + amount;
	}

	for (const d of discounts) {
		let maxAmount = Number(d.amount);
		let amount = Number(d.amount);

		if (d.sum === "percent") {
			amount = ((itemsTotal + taxTotal) * amount) / 100;
			maxAmount = ((maxItemsTotal + maxTaxTotal) * amount) / 100;
		}

		discountTotal = discountTotal + amount;
		maxDiscountTotal = maxDiscountTotal + maxAmount;
	}
	const totalAmount = itemsTotal + taxTotal - discountTotal;
	const maxTotalAmount = maxItemsTotal + maxTaxTotal;

	return {
		itemsTotal,
		maxItemsTotal,
		discountTotal,
		taxTotal,
		totalAmount,
		totalSaved: maxTotalAmount - totalAmount,
	};
}
