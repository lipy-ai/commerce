import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProductInCart = {
	id: string;
	quantity: number;
	unit: string | null;
	title: string;
	price: number | null;
	maxPrice: number | null;
	thumbnail: string | null;
};
export type Operation = "increment" | "decrement" | "add";

export type CartStore = {
	cart: ProductInCart[];
	initialized: boolean;
	updateCart: (
		product: {
			id: string;
			unit: string | null;
			title: string;
			price: number | null;
			maxPrice: number | null;
			thumbnail: string | null;
		},
		operation?: Operation,
	) => void;
	setCart: (items: ProductInCart[]) => void;
	resetCart: () => void;
};

const defaultValues = {
	cart: [],
	initialized: false,
};

export const useCartStore = create<CartStore>()(
	persist(
		(set) => ({
			...defaultValues,
			updateCart: (product, operation) => {
				set((state) => {
					const existingItem = state.cart.find(
						(item) => item.id === product.id,
					);

					let updatedCart: ProductInCart[];

					if (existingItem) {
						updatedCart = state.cart.map((item) => {
							if (item.id === product.id) {
								let newQuantity = item.quantity;

								if (operation === "increment") newQuantity += 1;
								else if (operation === "decrement") newQuantity -= 1;

								return { ...item, quantity: newQuantity };
							}
							return item;
						});
					} else {
						updatedCart = [
							...state.cart,
							{
								id: product.id,
								quantity: 1,
								unit: product.unit,
								title: product.title,
								price: product.price,
								maxPrice: product.maxPrice,
								thumbnail: product.thumbnail,
							},
						];
					}

					const finalCart = updatedCart.filter((item) => item.quantity > 0);
					return { cart: finalCart };
				});
			},
			setCart: (items) =>
				set({
					cart: items,
					initialized: true,
				}),

			resetCart: () => set({ cart: [], initialized: false }),
		}),
		{
			name: "lipy-cart-state",
			storage: createJSONStorage(() => localStorage),
			// Only persist the cart — not `initialized`
			partialize: (state) => ({ cart: state.cart }),
		},
	),
);
