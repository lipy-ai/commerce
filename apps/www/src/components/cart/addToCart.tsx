import { loggedInCartApi } from "@lipy/lib/api";
import {
  apiQueryOptions,
  useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import { Button } from "@lipy/web-ui/components/ui/button";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Minus, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { type Operation, useCartStore } from "./store";

type LoadingState = {
  isLoading: boolean;
  operation: Operation | null;
};

export const AddToCart = ({
  product,
  variant,
  activeVariant,
  disabled = false,
}: {
  product: {
    inventoryId: string;
    quantity: number;
  };
  variant: "primary" | "secondary" | "active";
  activeVariant?: "primary-active" | "secondary-active" | "tertiary-active";
  disabled?: boolean;
  thumbnail?: string;
}) => {
  const { cart, updateCart } = useCartStore();
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    operation: null,
  });

  const queryClient = useQueryClient();
  const mutation = useAPIMutation(loggedInCartApi.index, "$patch", {
    onSuccess: () => {
      if (loadingState.operation) {
        updateCart(product, loadingState.operation);
      }
      queryClient.invalidateQueries({
        queryKey: apiQueryOptions(loggedInCartApi.index, "$get", {}).queryKey,
      });
    },
    onError: () => {
      toast.error("Something went wrong while adding to cart");
    },
  });

  const productInCart = cart.find(
    (item) => item.inventoryId === product.inventoryId
  );

  const setLoading = useCallback((operation: Operation | null) => {
    setLoadingState({
      isLoading: !!operation,
      operation,
    });
  }, []);

  const executeCartOperation = useCallback(
    async (operation: Operation, quantity: number) => {
      if (disabled || loadingState.isLoading) return;

      setLoading(operation);

      try {
        await mutation.mutateAsync({
          json: {
            quantity,
            inventoryId: product.inventoryId || "",
          },
        });
      } finally {
        setLoading(null);
      }
    },
    [
      disabled,
      loadingState.isLoading,
      mutation,
      product.inventoryId,
      setLoading,
    ]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      executeCartOperation("add", 1);
    },
    [executeCartOperation]
  );

  const handleQuantityChange = useCallback(
    (operation: "increment" | "decrement") =>
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (!productInCart) return;

        const newQuantity =
          operation === "increment"
            ? (productInCart.quantity || 0) + 1
            : Math.max(0, (productInCart.quantity || 0) - 1);

        executeCartOperation(operation, newQuantity);
      },
    [executeCartOperation, productInCart]
  );

  // Determine the variant to render
  const computedVariant = productInCart ? "active" : variant;
  const isLoading = loadingState.isLoading;

  switch (computedVariant) {
    case "primary":
      return (
        <Button
          size="xs"
          onClick={handleAddToCart}
          disabled={disabled || isLoading}
          type="button"
          aria-label="Add to cart"
          className="text-secondary border border-secondary min-w-16 hover:text-secondary border-b-2 border-r-2 disabled:opacity-100 font-medium"
          variant={"outline"}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <p>ADD</p>}
        </Button>
      );

    case "secondary":
      return (
        <Button
          onClick={handleAddToCart}
          disabled={disabled || isLoading}
          aria-label="Add to cart"
          size="default"
          className="min-w-32"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <p>Add to cart</p>
          )}
        </Button>
      );

    case "active": {
      const currentQuantity = productInCart?.quantity || 0;
      const isDecrementLoading =
        isLoading && loadingState.operation === "decrement";
      const isIncrementLoading =
        isLoading && loadingState.operation === "increment";

      return (
        <div
          className={cn(
            activeVariant === "secondary-active"
              ? "bg-primary min-w-32"
              : activeVariant === "tertiary-active"
                ? "bg-secondary/20 ring-1 ring-secondary/40"
                : "bg-secondary ",
            "flex items-center  shadow-sm rounded-md justify-between"
          )}
        >
          <Button
            size={
              activeVariant === "secondary-active"
                ? "lg"
                : activeVariant === "tertiary-active"
                  ? "icon-xs"
                  : "xs"
            }
            onClick={handleQuantityChange("decrement")}
            disabled={disabled || isLoading}
            aria-label="Decrease quantity"
            variant="ghost"
            className={cn(
              activeVariant === "secondary-active"
                ? "bg-primary hover:bg-primary"
                : activeVariant === "tertiary-active"
                  ? "hover:bg-primary/10 "
                  : "hover:bg-secondary",
              "text-primary-foreground  hover:text-primary-foreground"
            )}
          >
            {isDecrementLoading ? (
              <Loader2
                className={cn(
                  activeVariant === "tertiary-active"
                    ? "text-foreground"
                    : null,
                  "animate-spin"
                )}
              />
            ) : (
              <Minus
                className={cn(
                  activeVariant === "tertiary-active"
                    ? "text-secondary"
                    : "stroke-3 ",
                  "h-3 w-3 "
                )}
              />
            )}
          </Button>

          <div className="min-w-[2px] flex items-center justify-center ">
            {isLoading &&
            (loadingState.operation === "add" ||
              (!isDecrementLoading && !isIncrementLoading)) ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span
                className={cn(
                  activeVariant === "tertiary-active"
                    ? ""
                    : "font-semibold  text-primary-foreground",
                  "text-sm px-1 font-semibold"
                )}
              >
                {currentQuantity}
              </span>
            )}
          </div>

          <Button
            size={
              activeVariant === "secondary-active"
                ? "lg"
                : activeVariant === "tertiary-active"
                  ? "icon-xs"
                  : "xs"
            }
            onClick={handleQuantityChange("increment")}
            disabled={disabled || isLoading}
            aria-label="Increase quantity"
            variant="ghost"
            className={cn(
              activeVariant === "secondary-active"
                ? "bg-primary hover:bg-primary"
                : activeVariant === "tertiary-active"
                  ? "hover:bg-primary/10"
                  : "hover:bg-secondary",
              "text-primary-foreground  hover:text-primary-foreground"
            )}
          >
            {isIncrementLoading ? (
              <Loader2
                className={cn(
                  activeVariant === "tertiary-active"
                    ? "text-foreground"
                    : null,
                  "animate-spin"
                )}
              />
            ) : (
              <Plus
                className={cn(
                  activeVariant === "tertiary-active"
                    ? "text-secondary"
                    : "stroke-3",
                  "h-3 w-3 "
                )}
              />
            )}
          </Button>
        </div>
      );
    }
    default:
      return null;
  }
};
