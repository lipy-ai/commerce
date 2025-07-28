import { loggedInCartApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { useEffect } from "react";
import { type ProductInCart, useCartStore } from "./store";

export const AppCartInitializer = () => {
  const setCart = useCartStore((state) => state.setCart);

  const { data, isFetched } = useAPIQuery(loggedInCartApi.basic, "$get", {});

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (isFetched && data) {
      setCart(data as ProductInCart[]);
    }
  }, [isFetched, data]);

  return null;
};
