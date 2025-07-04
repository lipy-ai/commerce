import type { apiClient } from "@lipy/lib/api";
import type { InferResponseType } from "hono";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type ProductInCart = InferResponseType<typeof apiClient.v1.cart.$get>[0];

export type Operation = "increment" | "decrement" | "add";

export type CartStore = {
	cart: ProductInCart[];
	initialized: boolean;
	updateCart: (product: ProductInCart, operation?: Operation) => void;
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
						(item) => item.inventoryId === product.inventoryId,
					);

					let updatedCart: ProductInCart[];

					if (existingItem) {
						updatedCart = state.cart.map((item) => {
							if (item.inventoryId === product.inventoryId) {
								let newQuantity = item.quantity || 0;

								if (operation === "increment") newQuantity += 1;
								else if (operation === "decrement") newQuantity -= 1;

								return { ...item, quantity: newQuantity };
							}
							return item;
						});
					} else {
						updatedCart = [...state.cart, { ...product, quantity: 1 }];
					}

					const finalCart = updatedCart.filter(
						(item) => (item.quantity || 0) > 0,
					);
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
