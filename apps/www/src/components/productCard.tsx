import { discountCalculator } from "@lipy/lib/helper/discountCalculator";
import { cn } from "@lipy/web-ui/lib/utils";
import { AddToCart } from "./cart/addToCart";

export default function ProductCard({
	product,
	className,
	variant,
	...props
}: {
	className?: {
		classNameBox?: string;
		classNameImg?: string;
	};
	product: any;
	variant?: "default" | "horizontal";
	thumbnail?: string;
}) {
	const discountPercentage = discountCalculator(
		product.price,
		product.maxPrice,
	);

	switch (variant) {
		case "horizontal": {
			return (
				<>
					<div
						className={cn(
							"flex items-center justify-between gap-4",
							className?.classNameBox,
						)}
					>
						<div className="flex items-center gap-2">
							<div className=" relative aspect-square">
								<img
									alt={""}
									src={props?.thumbnail || "/assets/paper-bag-items.webp"}
									className={cn(
										"w-full h-full object-cover rounded-md bg-gray-200",
										className?.classNameImg,
									)}
								/>
							</div>

							<div>
								<p className="text-sm font-medium line-clamp-2">
									{product.title}
								</p>
								<p className="text-muted-foreground">
									{product.quantity} {product.unit}
								</p>
							</div>
						</div>
						<div className="flex flex-col items-center gap-1">
							<AddToCart product={product} variant={"icon"} />
							<div className="flex items-center gap-2">
								<p className="line-through text-muted-foreground">
									₹{product.maxPrice * product.quantity}
								</p>
								<p className="font-semibold">
									₹{product.price * product.quantity}
								</p>
							</div>
						</div>
					</div>
				</>
			);
		}

		default:
			return (
				<div className={cn("", className?.classNameBox)}>
					<div className=" relative aspect-square">
						<img
							alt={""}
							src={props?.thumbnail || "/assets/paper-bag-items.webp"}
							className={cn(
								"w-full h-30 object-cover rounded-md bg-gray-200",
								className?.classNameImg,
							)}
						/>

						{discountPercentage > 0 && (
							<div className="absolute top-0 left-0 bg-orange-400 text-white rounded-br-sm px-2 py-1 text-xs font-semibold clip-zigzag">
								{discountPercentage}%<p>Off</p>
							</div>
						)}

						<div className="absolute -bottom-1 -right-1">
							<AddToCart
								product={product}
								variant={"icon"}
								thumbnail={props.thumbnail}
							/>
						</div>
					</div>

					<p className="py-1 text-sm font-medium">{product.title}</p>

					<span className="font-bold text-md pr-2"> ₹{product.price}</span>
					{product.maxPrice && (
						<span className="text-xs line-through text-muted-foreground">
							₹{product.maxPrice}
						</span>
					)}
				</div>
			);
	}
}
