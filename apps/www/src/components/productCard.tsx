import { discountCalculator } from "@lipy/lib/helper/discountCalculator";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Button } from "@lipy/web-ui/components/ui/button";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AddToCart } from "./cart/addToCart";
import { useCartStore } from "./cart/store";

export type ProductType = {
	id: string;
	price: number;
	maxPrice: number;
	title?: string;
	thumbnail: string;
	storeId?: string;
	category?: string;
	rn?: number;
	quantity?: number;
	unit?: string;
	variants: Array<{
		id: string;
		price: number;
		maxPrice: number;
		stockQty: number;
		title: string;
		unit: string;
	}>;
};
export default function ProductCard({
	product,
	className,
	variant = "default",
	shopHandle,
}: {
	className?: {
		classNameBox?: string;
		classNameImg?: string;
	};
	product: ProductType;
	variant?: "default" | "horizontal";
	shopHandle?: string;
}) {
	const discountPercentage = discountCalculator(
		product?.price,
		product?.maxPrice,
	);

	const [variantDrawer, setVariantDrawer] = useState(false);
	const [_, setActiveProduct] = useState<ProductType>();

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
						<div className="flex items-start gap-2">
							<div className=" relative aspect-square">
								<img
									alt={""}
									src={product.thumbnail || "/assets/paper-bag-items.webp"}
									className={cn(
										"w-full h-full object-cover rounded-md bg-gray-200",
										className?.classNameImg,
									)}
								/>
							</div>

							<div>
								<p className="text-xs font-medium line-clamp-2">
									{product.title}
								</p>
								<p className="text-muted-foreground text-xs">
									{product.quantity} {product.unit}
								</p>
							</div>
						</div>
						<div className="flex flex-col items-center gap-1">
							<AddToCart product={product} variant={"icon"} />
							<div className="flex items-center gap-2">
								<p className="line-through text-muted-foreground">
									{formatAmount(
										"inr",
										product.maxPrice * (product.quantity as number),
									)}
								</p>
								<p className="font-semibold">
									{formatAmount(
										"inr",
										product.price * (product.quantity as number),
									)}
								</p>
							</div>
						</div>
					</div>
				</>
			);
		}

		default: {
			let cartCount = 0;
			const { cart } = useCartStore();

			for (const cartItem of cart) {
				if (cart.length === 0) break;
				for (const variant of product.variants) {
					if (product.variants.length === 0) break;

					if (variant.id === cartItem.id) {
						cartCount += 1;
					}
				}
			}

			return (
				<div>
					<Link
						className={cn(
							variantDrawer ? "pointer-events-none" : "pointer-events-auto",
							className?.classNameBox,
						)}
						to="/$shopHandle/products/$productId"
						params={{ shopHandle: shopHandle as string, productId: product.id }}
					>
						<div className=" relative aspect-square">
							<img
								alt={""}
								src={product.thumbnail || "/assets/paper-bag-items.webp"}
								className={cn(
									"w-full h-30 object-cover rounded-md bg-gray-200",
									className?.classNameImg,
								)}
							/>

							<div className="absolute -bottom-1 -right-1">
								{product.variants.length <= 1 ? (
									<AddToCart product={product.variants[0]} variant={"icon"} />
								) : cartCount === 0 ? (
									<Button
										size="icon-sm"
										type="button"
										variant="green-outline"
										aria-label="Add to cart"
										className="bg-card"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();

											setVariantDrawer(true);
											setActiveProduct(product);
										}}
									>
										<Plus className="size-3" strokeWidth={3} />
									</Button>
								) : (
									<div
										className="bg-tertiary flex items-center  rounded-lg shadow-sm"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();

											setVariantDrawer(true);
											setActiveProduct(product);
										}}
									>
										<Button
											size="icon-sm"
											variant="ghost"
											className="text-white"
										>
											<Minus className="h-3 w-3" />
										</Button>

										<div className="min-w-[2px] flex items-center justify-center">
											<span className="font-semibold text-white text-sm px-1">
												{cartCount}
											</span>
										</div>

										<Button
											size="icon-sm"
											variant="ghost"
											className="text-white"
										>
											<Plus className="h-3 w-3" strokeWidth={2} />
										</Button>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-0.5">
							<p className="py-1 text-xs font-medium">{product.title}</p>
							<div>
								{discountPercentage > 0 && (
									<p className="text-xs text-blue-600 font-medium">
										{discountPercentage}% OFF
									</p>
								)}

								<span className="font-bold text-md pr-1">
									{" "}
									{formatAmount("inr", product.price)}
								</span>
								{product.maxPrice && (
									<span className="text-xs line-through text-muted-foreground">
										{formatAmount("inr", product.maxPrice)}
									</span>
								)}
							</div>
						</div>
					</Link>
					{variantDrawer && (
						<VariantList
							open={variantDrawer}
							onOpenChange={setVariantDrawer}
							product={product}
						/>
					)}
				</div>
			);
		}
	}
}

function VariantList({
	open,
	onOpenChange,
	product,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	product: ProductType;
}) {
	return (
		<DrawerDialogSwitcher open={open} onOpenChange={onOpenChange}>
			<DrawerDialogHeader>
				<DrawerDialogTitle>{product.title}</DrawerDialogTitle>
			</DrawerDialogHeader>

			<div className="space-y-1">
				{product.variants?.map((variant) => (
					<div
						key={variant.id}
						className="bg-card p-4 shadow-xs rounded-lg flex items-center justify-between cursor-pointer"
					>
						<div>
							<p className="text-sm font-medium">{variant.title}</p>
							<span className="font-bold text-md pr-1">
								{" "}
								{formatAmount("inr", variant.price)}
							</span>
							{product.maxPrice && (
								<span className="text-xs line-through text-muted-foreground">
									{formatAmount("inr", variant.maxPrice)}
								</span>
							)}
						</div>

						<AddToCart product={variant} variant={"primary"} />
					</div>
				))}
			</div>
		</DrawerDialogSwitcher>
	);
}
