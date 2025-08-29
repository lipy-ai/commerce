import { merchantStoreApi, posStoreApi, publicShopApi } from "../api";
import { authClient } from "../providers/auth";
import { useAPIQuery } from "../utils/useQueryClient";
import { useAuthSession } from "./use-auth";

export const useStore = () => {
  const res = useAPIQuery(merchantStoreApi.index, "$get", {});
  return res;
};

export const usePosStore = () => {
  const { data } = useAuthSession();

  const h = data?.session?.activeStoreHandle || "";

  const res = useAPIQuery(
    posStoreApi[":handle"],
    "$get",
    {
      param: { handle: h },
    },
    { enabled: !!h }
  );
  return res;
};

export const usePublicStore = (props?: { handle?: string }) => {
  const { data } = authClient.useSession();

  const h = props?.handle || data?.session?.activeStoreHandle || "";

  const res = useAPIQuery(
    publicShopApi[":handle"],
    "$get",
    {
      param: { handle: h },
    },
    { enabled: !!h }
  );
  return res;
};
