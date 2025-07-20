import { loggedInCartApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { useEffect } from "react";
import { useCartStore } from "./store";

export const AppCartInitializer = () => {
  const setCart = useCartStore((state) => state.setCart);

  const { data, isFetched } = useAPIQuery(loggedInCartApi.index, "$get", {});

  useEffect(() => {
    if (isFetched && data) {
      setCart(data);
    }
  }, [isFetched, data, setCart]);

  return null;
};
