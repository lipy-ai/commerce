import { loggedInCartApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { useEffect } from "react";
import { type ProductInCart, useCartStore } from "./store";
import { authClient } from "@lipy/lib/providers/auth";

export const AppCartInitializer = () => {
  const setCart = useCartStore((state: any) => state.setCart);

  const { data: session } = authClient.useSession();

  const { data, isFetched } = useAPIQuery(
    loggedInCartApi.basic,
    "$get",
    {},
    { enabled: !!session }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    if (isFetched && data) {
      setCart(data as ProductInCart[]);
    }
  }, [isFetched, data]);

  return null;
};
