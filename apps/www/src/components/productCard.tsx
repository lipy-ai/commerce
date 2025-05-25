import { cn } from "@lipy/web-ui/lib/utils";
import { AddToCart } from "./cart/addToCart";

export default function ProductCard({ product, className, shopId }) {
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
					alt={""}
					src={product.thumbnail}
					className={cn("w-full h-30 object-cover rounded-md bg-gray-200")}
				/>
				{product.discountPercentage > 0 && (
					<div className="absolute top-0 left-0 bg-[hsl(24.6_95%_53.1%)] text-white rounded-br-sm px-2 py-1 text-xs font-semibold clip-zigzag">
						{Math.round(product.discountPercentage)}%<p>Off</p>
					</div>
				)}
				{/* <Button
					className="bg-white ring ring-primary text-primary font-bold text-2xl"
					size={"icon"}
				>
					<Plus />
				</Button> */}
				<div className="absolute -bottom-1 -right-1">
					<AddToCart shopId={shopId} product={product} variant={"icon"} />
				</div>
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
