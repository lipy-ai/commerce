import { apiClient } from "../api";
import { useAPIQuery } from "../utils/useQueryClient";

export const useStore = () => {
	const res = useAPIQuery(apiClient.v1.merchant.store, "$get", {});

	return res;
};
