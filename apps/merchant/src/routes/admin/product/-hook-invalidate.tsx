import { useQueryClient } from "@tanstack/react-query";

export const useProductInvalidate = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["$get", "/v1/admin/product"],
    });

  return { invalidate };
};

export const useVariantInvalidate = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({
      predicate: (query) =>
        Array.isArray(query.queryKey) &&
        query.queryKey[0] === "$get" &&
        typeof query.queryKey[1] === "string" &&
        query.queryKey[1].startsWith("/v1/admin/variant/"),
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
