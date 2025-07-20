import { useQueryClient } from "@tanstack/react-query";

export const useProductInvalidate = () => {
	const queryClient = useQueryClient();
	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: ["$get", "/v1/admin/product"],
		});
	return { invalidate };
};
