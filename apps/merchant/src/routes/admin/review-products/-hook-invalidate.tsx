import { useQueryClient } from "@tanstack/react-query";

export const useProductInvalidate = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["$get", "/v1/admin/review-product"],
    });
  return { invalidate };
};

export const useInventoryInvalidate = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["$get", "/v1/merchant/product"],
    });
  return { invalidate };
};
