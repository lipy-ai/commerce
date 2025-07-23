export function orderCalculator({
	items,
	discounts,
	taxes,
}: {
	items: Array<{ price: number; maxPrice?: number; qty: number }>;
	discounts: Array<{ amount: number }>;
	taxes: Array<{ amount: number }>;
}) {
	const itemsTotal = items.reduce(
		(sum, item) => sum + item.price * item.qty,
		0,
	);
	const maxItemsTotal = items.reduce(
		(sum, item) => sum + (item.maxPrice ?? item.price) * item.qty,
		0,
	);

	const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
	const taxTotal = taxes.reduce((sum, t) => sum + t.amount, 0);

	const totalAmount = itemsTotal + taxTotal - discountTotal;
	const maxTotalAmount = maxItemsTotal + taxTotal - discountTotal;

	return {
		itemsTotal,
		maxItemsTotal,
		discountTotal,
		taxTotal,
		totalAmount,
		totalSaved: maxTotalAmount - totalAmount,
	};
}
