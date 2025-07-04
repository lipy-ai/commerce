import { apiClient } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import { Button } from "@lipy/web-ui/components/ui/button";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { Loader2, Minus, Plus } from "lucide-react";
import { useCallback, useState } from "react";

import { type CartStore, type Operation, useCartStore } from "./store";

type LoadingState = {
	isLoading: boolean;
	operation: Operation | null;
};

export const AddToCart = ({
	product,
	variant,
	disabled = false,
}: {
	product: CartStore["cart"][0];
	variant: "icon" | "primary" | "active";
	disabled?: boolean;
	thumbnail?: string;
}) => {
	const { cart, updateCart } = useCartStore();
	const [loadingState, setLoadingState] = useState<LoadingState>({
		isLoading: false,
		operation: null,
	});

	const mutation = useAPIMutation(apiClient.v1.cart, "$patch", {
		onSuccess: () => {
			if (loadingState.operation) {
				updateCart(product, loadingState.operation);
			}
		},
		onError: () => {
			toast.error("Something went wrong while adding to cart");
		},
	});

	const productInCart = cart.find(
		(item) => item.inventoryId === product.inventoryId,
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
		],
	);

	const handleAddToCart = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			e.stopPropagation();
			executeCartOperation("add", 1);
		},
		[executeCartOperation],
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
		[executeCartOperation, productInCart],
	);

	// Determine the variant to render
	const computedVariant = productInCart ? "active" : variant;
	const isLoading = loadingState.isLoading;

	switch (computedVariant) {
		case "icon":
			return (
				<Button
					size="xs"
					onClick={handleAddToCart}
					disabled={disabled || isLoading}
					type="button"
					aria-label="Add to cart"
				>
					{isLoading ? (
						<Loader2 className="animate-spin" />
					) : (
						<Plus className="size-3 stroke-2" />
					)}
				</Button>
			);

		case "primary":
			return (
				<Button
					onClick={handleAddToCart}
					disabled={disabled || isLoading}
					aria-label="Add to cart"
					variant="secondary"
					className="relative w-12"
					size="sm"
				>
					{isLoading ? (
						<div className="absolute inset-0 flex justify-center items-center">
							<Loader2 className="animate-spin" />
						</div>
					) : (
						<span className="text-primary font-semibold">Add</span>
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
				<div className="bg-primary flex items-center  rounded-sm shadow-sm">
					<Button
						size="xs"
						onClick={handleQuantityChange("decrement")}
						disabled={disabled || isLoading}
						aria-label="Decrease quantity"
					>
						{isDecrementLoading ? (
							<Loader2 className="animate-spin stroke-2" />
						) : (
							<Minus className="h-3 w-3 stroke-2" />
						)}
					</Button>

					<div className="min-w-[2px] flex items-center justify-center">
						{isLoading &&
						(loadingState.operation === "add" ||
							(!isDecrementLoading && !isIncrementLoading)) ? (
							<Loader2 className="animate-spin stroke-2" />
						) : (
							<span className="font-semibold text-white text-sm px-1">
								{currentQuantity}
							</span>
						)}
					</div>

					<Button
						size="xs"
						onClick={handleQuantityChange("increment")}
						disabled={disabled || isLoading}
						aria-label="Increase quantity"
					>
						{isIncrementLoading ? (
							<Loader2 className="animate-spin stroke-2" />
						) : (
							<Plus className="h-3 w-3 stroke-2" />
						)}
					</Button>
				</div>
			);
		}

		default:
			return null;
	}
};
