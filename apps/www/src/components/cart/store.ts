import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProductInCart = {
	shopId: string;
	productId: string;
	quantity: number;
	unit: string | null;
	name: string;
	price: number;
	originalPrice: number;
};

type CartStore = {
	cart: ProductInCart[];
	addToCart: (product: ProductInCart) => void;
	updateProductQuantity: (
		shopId: string,
		productId: string,
		quantityChange: number,
		operation: "increment" | "decrement",
	) => void;
};

export const useCartStore = create(
	persist<CartStore>(
		(set, get) => ({
			cart: [],
			addToCart: (product: ProductInCart) => {
				const currentCart = get().cart;
				set({ cart: [...currentCart, product] });
			},
			updateProductQuantity: (shopId, productId, quantityChange, operation) => {
				set((state) => {
					const updatedCart = state.cart.map((item) => {
						if (item.shopId === shopId && item.productId === productId) {
							let newQuantity = item.quantity;
							if (operation === "increment") {
								newQuantity += quantityChange;
							} else if (operation === "decrement") {
								newQuantity -= quantityChange;
							}

							// If quantity becomes zero or negative, remove item in next step
							return { ...item, quantity: newQuantity };
						}
						return item;
					});

					// Filter out items with quantity <= 0
					const finalCart = updatedCart.filter((item) => item.quantity > 0);

					return { cart: finalCart };
				});
			},
		}),
		{
			name: "lipy-cart-state",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
