import { apiClient } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/queryClient";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "./store";

export const AddToCart = ({
	shopId,
	product,
	variant,
}: {
	shopId: string;
	product: any;
	variant: "icon" | "primary" | "active";
}) => {
	const mutation = useAPIMutation(apiClient.v1.cart, "$patch", {});

	const handleAddToCart = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault(); // Prevent link from triggering
		e.stopPropagation(); // Stop bubbling up to Link

		const values = {
			quantity: 1,
			variant_id: 522820741255242,
		};

		mutation.mutateAsync({
			json: values,
		});
		// addToCart({
		// 	shopId,
		// 	productId: product.id,
		// 	quantity: product.minimumOrderQuantity,
		// 	unit: null,
		// 	name: product.title,
		// 	price: product.price,
		// 	originalPrice: product.price,
		// });
	};
	const { addToCart, cart, updateProductQuantity } = useCartStore();

	const updateQuantity = ({
		operation,
		e,
	}: {
		operation: "increment" | "decrement";
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>;
	}) => {
		e.preventDefault(); // Prevent link from triggering
		e.stopPropagation(); // Stop bubbling up to Link
		const quantityChange = product.minimumOrderQuantity;

		updateProductQuantity(shopId, product.id, quantityChange, operation);
	};

	let ProductInCart = {};

	cart.map((item) => {
		if (item.shopId === shopId && item.productId === product.id) {
			variant = "active";
			ProductInCart = item;
		}
	});

	switch (variant) {
		case "icon":
			return (
				<Button
					className="ring ring-primary text-primary font-bold text-2xl"
					size={"icon"}
					onClick={handleAddToCart}
					type="button"
					variant={"outline"}
				>
					<Plus />
				</Button>
			);
		case "primary":
			return (
				<Button
					className="bg-primary text-white font-bold"
					onClick={handleAddToCart}
				>
					Add to Cart
				</Button>
			);
		case "active":
			return (
				<div className="bg-primary flex items-center gap-1 rounded-lg">
					<Button
						size="icon"
						onClick={(e) => updateQuantity({ operation: "decrement", e })}
					>
						<Minus />
					</Button>
					<span className="font-semibold text-white">
						{ProductInCart?.quantity || product.minimumOrderQuantity}
					</span>
					<Button
						size="icon"
						onClick={(e) => updateQuantity({ operation: "increment", e })}
					>
						<Plus strokeWidth={1.5} />
					</Button>
				</div>
			);
	}
};
