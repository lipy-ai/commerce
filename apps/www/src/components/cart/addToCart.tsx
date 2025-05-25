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
	const handleAddToCart = () => {
		addToCart({
			shopId,
			productId: product.id,
			quantity: product.minimumOrderQuantity,
			unit: null,
			name: product.title,
			price: product.price,
			originalPrice: product.price,
		});

		console.log(cart);
	};
	const { addToCart, cart, updateProductQuantity } = useCartStore();

	const updateQuantity = ({
		operation,
	}: {
		operation: "increment" | "decrement";
	}) => {
		const quantityChange = product.minimumOrderQuantity;

		updateProductQuantity(shopId, product.id, quantityChange, operation);
		console.log(cart);
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
					className="bg-white ring ring-primary text-primary font-bold text-2xl"
					size={"icon"}
					onClick={handleAddToCart}
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
						onClick={() => updateQuantity({ operation: "decrement" })}
					>
						<Minus />
					</Button>
					<span className="font-semibold text-white">
						{ProductInCart?.quantity || product.minimumOrderQuantity}
					</span>
					<Button
						size="icon"
						onClick={() => updateQuantity({ operation: "increment" })}
					>
						<Plus strokeWidth={1.5} />
					</Button>
				</div>
			);
	}
};
