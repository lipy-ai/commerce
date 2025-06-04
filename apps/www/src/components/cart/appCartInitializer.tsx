import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { useEffect } from "react";
import { useCartStore } from "./store";

export const AppCartInitializer = () => {
	const setCartFromDB = useCartStore((state) => state.setCartFromDB);

	const { data, isFetched } = useAPIQuery(apiClient.v1.cart, "$get", {});

	useEffect(() => {
		if (isFetched && data) {
			const mappedCart = data.map((item: any) => ({
				id: item.variantId,
				quantity: item.quantity,
				unit: item.variantUnit,
				title: item.variantTitle,
				price: item.variantPrice,
				maxPrice: item.variantMaxPrice,
				thumbnail: item.thumbnail,
			}));

			setCartFromDB(mappedCart);
		}
	}, [isFetched, data, setCartFromDB]);

	return null;
};
