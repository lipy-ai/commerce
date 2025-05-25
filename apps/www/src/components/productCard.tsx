import { cn } from "@lipy/web-ui/lib/utils";
import { AddToCart } from "./cart/addToCart";

export default function ProductCard({
	product,
	className,
	shopId,
}: {
	className?: {
		classNameBox?: string;
		classNameImg?: string;
	};
	shopId: string;
	product: any;
}) {
	const originalPrice = product.discountPercentage
		? Math.round(product.price / (1 - product.discountPercentage / 100))
		: null;

	// Format price to show only two decimal places when needed
	const formatPrice = (price) => {
		return price % 1 === 0 ? price : price.toFixed(2);
	};

	return (
		<div className={cn("", className?.classNameBox)}>
			<div className=" relative aspect-square">
				<img
					alt={""}
					src={product.thumbnail}
					className={cn(
						"w-full h-30 object-cover rounded-md bg-gray-200",
						className?.classNameImg,
					)}
				/>

				{/* {product.discountPercentage > 0 && (
					<div className="absolute top-0 left-0 bg-orange-400 text-white rounded-br-sm px-2 py-1 text-xs font-semibold clip-zigzag">
					className={cn("w-full h-30 object-cover rounded-md bg-gray-200")}
				/> */}
				{product.discountPercentage > 0 && (
					<div className="absolute top-0 left-0 bg-primary text-white rounded-br-sm px-2 py-1 text-xs font-semibold clip-zigzag">
						{Math.round(product.discountPercentage)}%<p>Off</p>
					</div>
				)}

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
