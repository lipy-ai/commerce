import { useQueryClient } from "@tanstack/react-query";

export const useCategoryInvalidate = () => {
	const queryClient = useQueryClient();
	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: ["$get", "/v1/admin/category"],
		});
	return { invalidate };
};
