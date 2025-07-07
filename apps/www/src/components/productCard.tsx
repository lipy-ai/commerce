import type { apiClient } from "@lipy/lib/api";
import { discountCalculator } from "@lipy/lib/helper/discountCalculator";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import type { InferResponseType } from "hono";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { AddToCart } from "./cart/addToCart";
import { type CartStore, useCartStore } from "./cart/store";

export type ProductType = Omit<
	InferResponseType<
		(typeof apiClient.v1.shops)[":storeHandle"]["categories"]["$get"]
	>["items"][number]["products"][number],
	"rn"
>;

export default function ProductCard({
	product,
	className,
	variant = "default",
	storeHandle,
}: {
	className?: {
		classNameBox?: string;
		classNameImg?: string;
	};
	product: ProductType;
	variant?: "default" | "horizontal";
	storeHandle?: string;
}) {
	const discountPercentage = discountCalculator(
		product.variants[0]?.price as number,
		product.variants[0]?.maxPrice as number,
	);

	const [variantDrawer, setVariantDrawer] = useState(false);
	const [_, setActiveProduct] = useState<ProductType>();

	switch (variant) {
		case "horizontal": {
			return;
		}

		default: {
			let cartCount = 0;
			const { cart } = useCartStore();

			for (const cartItem of cart) {
				if (cart.length === 0) break;
				for (const variant of product.variants as any) {
					if (product?.variants && product?.variants.length === 0) break;

					if (variant.inventoryId === cartItem.inventoryId) {
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
						to="/$storeHandle/products/$productId"
						params={{ storeHandle: storeHandle ?? "", productId: product.id }}
					>
						<div className=" relative aspect-square ">
							<div className="relative w-full">
								<img
									alt=""
									src={product.thumbnail || "/assets/paper-bag-items.webp"}
									className={cn(
										"w-full h-full object-cover rounded-xl bg-accent",
										product?.variants[0].inStock ? "" : "",
										className?.classNameImg,
									)}
								/>

								{!product?.variants[0].inStock && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
										<span className="text-white text-lg font-semibold">
											Out of stock
										</span>
									</div>
								)}
							</div>

							<div className="absolute bottom-1 right-1">
								{product?.variants && product?.variants.length <= 1 ? (
									<AddToCart
										product={
											{
												storeHandle: storeHandle ?? null,
												thumbnail: product.thumbnail ?? null,
												title: product.title ?? null,
												storeName: null,
												quantity: null,
												...product.variants[0],
											} as CartStore["cart"][0]
										}
										variant={"icon"}
									/>
								) : cartCount === 0 ? (
									<Button
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();

											setVariantDrawer(true);
											setActiveProduct(product);
										}}
										size="sm"
										type="button"
										aria-label="Add to cart"
										className="min-w-12"
									>
										Add
									</Button>
								) : (
									<div
										className="bg-primary flex items-center  rounded-md shadow-sm"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();

											setVariantDrawer(true);
											setActiveProduct(product);
										}}
									>
										<Button
											size="sm"
											variant="ghost"
											className="text-white hover:bg-primary hover:text-white"
										>
											<Minus className="h-3 w-3 stroke-3" />
										</Button>

										<div className="min-w-[2px] flex items-center justify-center">
											<span className="font-semibold text-white text-sm px-1">
												{cartCount}
											</span>
										</div>

										<Button
											size="sm"
											variant="ghost"
											className="text-white hover:bg-primary hover:text-white"
										>
											<Plus className="h-3 w-3 stroke-3" />
										</Button>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-0.5 my-1">
							<div className="py-1">
								<Badge className="text-xs" variant="subtle" size="compact">
									{product.variants[0].unit}
								</Badge>
								<p className="font-medium line-clamp-3">{product.title}</p>
							</div>

							<div>
								{discountPercentage > 0 && (
									<p className="text-xs text-blue-600 font-medium">
										{discountPercentage}% OFF
									</p>
								)}

								<span className="font-bold text-md pr-1">
									{" "}
									{formatAmount("inr", product.variants[0]?.price as number)}
								</span>
								{product.variants[0].maxPrice && (
									<span className="text-xs line-through text-muted-foreground">
										{formatAmount("inr", product.variants[0].maxPrice)}
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
							storeHandle={storeHandle}
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
	storeHandle,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	product: ProductType;
	storeHandle?: string;
}) {
	return (
		<DrawerDialogSwitcher open={open} onOpenChange={onOpenChange}>
			<DrawerDialogHeader>
				<DrawerDialogTitle>{product.title}</DrawerDialogTitle>
			</DrawerDialogHeader>

			<div className="space-y-1">
				{product.variants?.map((variant: ProductType["variants"][0]) => (
					<div
						key={variant.inventoryId}
						className="bg-card p-4 shadow-xs rounded-lg flex items-center justify-between cursor-pointer"
					>
						<div>
							<p>{variant.unit}</p>
							<span className="font-bold text-md pr-1">
								{" "}
								{formatAmount("inr", variant?.price as number)}
							</span>
							{variant.maxPrice && (
								<span className="text-xs line-through text-muted-foreground">
									{formatAmount("inr", variant.maxPrice)}
								</span>
							)}
						</div>

						<AddToCart
							product={
								{
									title: product.title ?? null,
									thumbnail: product.thumbnail ?? null,
									storeHandle: storeHandle ?? null,
									storeName: null,
									quantity: null,
									...variant,
								} as CartStore["cart"][0]
							}
							variant={"icon"}
						/>
					</div>
				))}
			</div>
		</DrawerDialogSwitcher>
	);
}
