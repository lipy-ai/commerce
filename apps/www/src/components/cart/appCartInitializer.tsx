import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { useEffect } from "react";
import { useCartStore } from "./store";

export const AppCartInitializer = () => {
	const setCart = useCartStore((state) => state.setCart);

	const { data, isFetched } = useAPIQuery(apiClient.v1.cart, "$get", {});

	useEffect(() => {
		if (isFetched && data) {
			setCart(data);
		}
	}, [isFetched, data, setCart]);

	return null;
};
