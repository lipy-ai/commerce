import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "./store";

export const CartPage = () => {
	const cart = useCartStore((state) => state.cart);
	const updateCart = useCartStore((state) => state.updateCart);

	const subtotal = cart.reduce(
		(acc, item) => acc + (item.price || 0) * item.quantity,
		0,
	);

	if (cart.length === 0) {
		return (
			<div className="max-w-2xl mx-auto p-6 text-center text-muted-foreground">
				<p>Your cart is empty.</p>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold">Your Cart</h1>

			{cart.map((item) => (
				<Card key={item.id + item.unit}>
					<CardContent className="p-4 flex items-center justify-between gap-4">
						<div className="flex-1">
							<p className="text-base font-medium">{item.title}</p>
							<p className="text-sm text-muted-foreground">{item.unit}</p>
							<p className="text-sm text-muted-foreground">
								₹{item.price?.toFixed(2)} each
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									updateCart({ ...item, id: item.id }, "decrement")
								}
							>
								<Minus className="w-4 h-4" />
							</Button>
							<span className="w-8 text-center">{item.quantity}</span>
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									updateCart({ ...item, id: item.id }, "increment")
								}
							>
								<Plus className="w-4 h-4" />
							</Button>
						</div>
						<div className="text-right">
							<p className="font-medium">
								₹{((item.price || 0) * item.quantity).toFixed(2)}
							</p>
						</div>
					</CardContent>
				</Card>
			))}

			<Separator />

			<div className="flex justify-between items-center text-base">
				<span className="font-medium">Subtotal</span>
				<span className="font-semibold">₹{subtotal.toFixed(2)}</span>
			</div>

			<Button className="w-full text-base" size="lg">
				Proceed to Checkout
			</Button>
		</div>
	);
};
