import { merchantStoreApi } from "../api";
import { useAPIQuery } from "../utils/useQueryClient";

export const useStore = () => {
	const res = useAPIQuery(merchantStoreApi.index, "$get", {});
	return res;
};
