import { apiClient } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/queryClient";
import { Button } from "@lipy/web-ui/components/ui/button";
import { cn } from "@lipy/web-ui/lib/utils";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCallback, useState } from "react";
import { type Operation, useCartStore } from "./store";

type LoadingState = {
	isLoading: boolean;
	operation: Operation | null;
};

export const AddToCart = ({
	product,
	variant,
	disabled = false,
}: {
	product: any;
	variant: "icon" | "primary" | "active";
	disabled?: boolean;
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
		onError: (error) => {
			// Handle error appropriately - could show toast notification
			console.error("Cart operation failed:", error);
		},
	});

	const productInCart = cart.find((item) => item.id === product.id);

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
						variantId: product.id,
					},
				});
			} finally {
				setLoading(null);
			}
		},
		[disabled, loadingState.isLoading, mutation, product.id, setLoading],
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
						? productInCart.quantity + 1
						: Math.max(0, productInCart.quantity - 1);

				executeCartOperation(operation, newQuantity);
			},
		[executeCartOperation, productInCart],
	);

	// Determine the variant to render
	const computedVariant = productInCart ? "active" : variant;
	const isLoading = loadingState.isLoading;

	const LoadingSpinner = ({
		size = "default",
	}: { size?: "sm" | "default" }) => (
		<Loader2
			className={cn("animate-spin", size === "sm" ? "h-3 w-3" : "h-4 w-4")}
		/>
	);

	switch (computedVariant) {
		case "icon":
			return (
				<Button
					className={cn(
						"text-primary border-primary border-2 ",
						isLoading && "opacity-75",
					)}
					size="icon"
					onClick={handleAddToCart}
					disabled={disabled || isLoading}
					type="button"
					variant="outline"
					aria-label="Add to cart"
				>
					{isLoading ? (
						<LoadingSpinner />
					) : (
						<Plus className="size-3" strokeWidth={3} />
					)}
				</Button>
			);

		case "primary":
			return (
				<Button
					className={cn(
						"bg-primary text-white font-semibold transition-all duration-200",
						"hover:bg-primary/90 active:scale-95",
						isLoading && "opacity-75",
					)}
					onClick={handleAddToCart}
					disabled={disabled || isLoading}
					aria-label="Add to cart"
				>
					{isLoading ? (
						<>
							<LoadingSpinner />
							<span className="ml-2">Adding...</span>
						</>
					) : (
						<>
							<ShoppingCart className="h-4 w-4 mr-2" />
							Add to Cart
						</>
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
				<div className="bg-primary flex items-center  rounded-lg shadow-sm">
					<Button
						size="icon"
						variant="ghost"
						onClick={handleQuantityChange("decrement")}
						disabled={disabled || isLoading}
						className={cn(
							"h-8 w-8 text-white hover:bg-white/20 transition-colors",
							"disabled:opacity-50 disabled:cursor-not-allowed",
						)}
						aria-label="Decrease quantity"
					>
						{isDecrementLoading ? (
							<LoadingSpinner size="sm" />
						) : (
							<Minus className="h-3 w-3" />
						)}
					</Button>

					<div className="min-w-[32px] flex items-center justify-center">
						{isLoading &&
						(loadingState.operation === "add" ||
							(!isDecrementLoading && !isIncrementLoading)) ? (
							<LoadingSpinner size="sm" />
						) : (
							<span className="font-semibold text-white text-sm px-1">
								{currentQuantity}
							</span>
						)}
					</div>

					<Button
						size="icon"
						variant="ghost"
						onClick={handleQuantityChange("increment")}
						disabled={disabled || isLoading}
						className={cn(
							"h-8 w-8 text-white hover:bg-white/20 transition-colors",
							"disabled:opacity-50",
						)}
						aria-label="Increase quantity"
					>
						{isIncrementLoading ? (
							<LoadingSpinner size="sm" />
						) : (
							<Plus className="h-3 w-3" strokeWidth={2} />
						)}
					</Button>
				</div>
			);
		}

		default:
			return null;
	}
};
