import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "./store";

export const PrimaryCartFooter = () => {
	const { cart } = useCartStore();
	if (cart.length === 0) return;
	return (
		<div className="fixed bottom-0 w-full p-4 bg-card shadow-xl flex items-center justify-between gap-4 border-t border-border/50 ">
			<div className="text-lg  flex items-center gap-2">
				<div className="rounded p-1 border border-border/50">
					<ShoppingCart className="size-6 fill-primary" />
				</div>

				{cart.length === 1 ? (
					<p>{cart.length} item</p>
				) : (
					<p>{cart.length} items</p>
				)}
			</div>

			<Link to="/cart" className={cn(buttonVariants())}>
				View Cart
				<ArrowRight />
			</Link>
		</div>
	);
};
