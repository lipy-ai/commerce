import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { useEffect } from "react";
import { useCartStore } from "./store";

export const AppCartInitializer = () => {
	const initialized = useCartStore((state) => state.initialized);
	const setCartFromDB = useCartStore((state) => state.setCartFromDB);

	const { data, isFetched } = useAPIQuery(apiClient.v1.cart, "$get", {
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !initialized,
	});

	useEffect(() => {
		if (!initialized && isFetched && data) {
			const mappedCart = data.map((item: any) => ({
				id: item.variant_id,
				quantity: item.quantity,
				unit: item.variant_unit,
				title: item.variant_title,
				price: item.variant_price,
				maxPrice: item.variant_maxPrice,
			}));

			setCartFromDB(mappedCart);
		}
	}, [initialized, isFetched, data, setCartFromDB]);

	return null;
};
