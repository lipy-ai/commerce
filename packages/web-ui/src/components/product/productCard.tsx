import { cn } from "@lipy/web-ui/lib/utils";
import { Badge, Plus } from "lucide-react";
import { Button } from "../ui/button";

export default function ProductCard({ product, className }) {
	const originalPrice = product.discountPercentage
		? Math.round(product.price / (1 - product.discountPercentage / 100))
		: null;

	// Format price to show only two decimal places when needed
	const formatPrice = (price) => {
		return price % 1 === 0 ? price : price.toFixed(2);
	};

	return (
		<div className={cn(className, "")}>
			<div className=" relative aspect-square">
				<img
					src={product.thumbnail}
					className={cn("w-full h-26 object-cover rounded-md bg-green-50")}
				/>
				{product.discountPercentage > 0 && (
					<div className="absolute top-0 left-0 bg-primary text-white rounded-br-sm py-0.5 px-1 text-xs font-semibold">
						{Math.round(product.discountPercentage)}% OFF
					</div>
				)}
				<Button
					className="absolute -bottom-1 -right-1 p-2 bg-white ring ring-primary text-primary font-bold text-2xl"
					size={"icon"}
				>
					<Plus />
				</Button>
			</div>

			<p className="py-1 text-sm font-medium">{product.title}</p>

			<span className="font-bold text-md pr-2"> ₹{product.price}</span>
			{originalPrice && (
				<span className="text-xs line-through text-muted-foreground">
					₹{formatPrice(originalPrice)}
				</span>
			)}
		</div>
	);
}
