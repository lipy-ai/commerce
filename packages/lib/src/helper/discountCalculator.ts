export const discountCalculator = (price: number, maxPrice: number) => {
	const discount = ((maxPrice - price) / maxPrice) * 100;
	return Math.round(discount);
};
