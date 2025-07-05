import { AddToCart } from "@/components/cart/addToCart";
import { apiClient } from "@lipy/lib/api";
import { discountCalculator } from "@lipy/lib/helper/discountCalculator";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import ImageCarousel from "@lipy/web-ui/components/custom-ui/imageCarousel";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute(
	"/(store)/$storeHandle/products/$productId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { productId, storeHandle } = Route.useParams();

	const {
		data: product,
		isFetching,
		isFetched,
	} = useAPIQuery(apiClient.v1.products[":id"], "$get", {
		param: {
			id: productId,
		},
	});

	type ProductResponse = InferResponseType<
		(typeof apiClient.v1.products)[":id"]["$get"]
	>;
	type ProductVariant = ProductResponse extends { variants: Array<infer V> }
		? V
		: unknown;

	const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();

	useEffect(() => {
		if (isFetched && product?.variants?.length) {
			setSelectedVariant(product.variants[0]);
		}
	}, [isFetched, product?.variants]);

	const discount = discountCalculator(
		selectedVariant?.price || 0,
		selectedVariant?.maxPrice || 0,
	);

	return (
		<div className="mb-20 [view-transition-name:main-content]">
			{isFetched && product && (
				<div>
					<DashboardHeader title={product.title || ""} />

					<ImageCarousel images={product.images || []} />
					<h3 className="font-bold text-xl px-4 pt-2">{product.title}</h3>
					{product.variants?.length === 1 && (
						<div className="px-4 py-2">
							<p className="font-medium text-base">
								{product.variants[0]?.unit}
							</p>
							<div>
								<span className="font-semibold text-lg pr-2">
									{formatAmount("inr", product.variants[0]?.price || 0)}
								</span>
								{product.variants[0]?.maxPrice && (
									<span className="text line-through text-muted-foreground">
										{formatAmount("inr", product.variants[0]?.maxPrice)}
									</span>
								)}
								{discount > 0 && <Badge variant="info">{discount}% OFF</Badge>}
							</div>
						</div>
					)}
					{product.variants?.length > 1 && (
						<div className="px-4 py-2">
							<Label className="text-muted-foreground">Select variant</Label>
							<div
								className="overflow-x-auto py-2 px-1 flex items-center gap-4"
								style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
							>
								{product.variants.map((variant) => (
									<div
										key={variant.inventoryId}
										className={cn(
											"cursor-pointer px-3 py-1 rounded-lg bg-muted/50",
											selectedVariant?.id === variant.id
												? "border-2 border-primary bg-primary/10"
												: "",
										)}
										onClick={() => setSelectedVariant(variant)}
									>
										<p className="line-clamp-1 text-sm mt-1 text-center">
											{variant.unit}
										</p>
										<div>
											<span className="font-semibold text-lg pr-2">
												{formatAmount("inr", variant.price || 0)}
											</span>
											{variant.maxPrice && (
												<span className="text-xs line-through text-muted-foreground">
													{formatAmount("inr", variant.maxPrice)}
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* {selectedVariant && (
						<div className="p-4">
							<p className="text-lg font-semibold">{selectedVariant.unit}</p>

							<div className="flex items-center justify-between">
								<div>
									<span className="font-semibold text-lg pr-2">
										{formatAmount("inr", selectedVariant.price || 0)}
									</span>
									{selectedVariant.maxPrice && (
										<span className="text-xs line-through text-muted-foreground">
											{formatAmount("inr", selectedVariant.maxPrice)}
										</span>
									)}
								</div>
								<AddToCart
									product={{
										...selectedVariant,
										quantity: null,
										thumbnail: product.thumbnail || "",
										title: product.title || "",
										storeHandle: storeHandle || "",
										storeName: "",
									}}
									variant="primary"
								/>
							</div>
						</div>
					)} */}

					{product?.highlights && product?.highlights?.length > 0 && (
						<Accordion type="single" collapsible className="bg-accent/40 my-4">
							<AccordionItem value="item-1">
								<AccordionTrigger className="hover:no-underline font-medium text-base px-6">
									Basic details
								</AccordionTrigger>
								<AccordionContent className="px-6 pb-6 space-y-4">
									{product.highlights.map((highlight) => (
										<div
											key={highlight.label}
											className="flex items-start justify-between"
										>
											<span className="text-muted-foreground flex-1">
												{highlight.label}
											</span>
											<span className="text-foreground font-normal flex-1 text-left">
												{highlight.value}
											</span>
										</div>
									))}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					)}

					{selectedVariant && (
						<div className="fixed bottom-0 w-full bg-card shadow-sm p-4 flex items-center justify-between">
							<div>
								<p className="font-medium">{selectedVariant?.unit}</p>
								<div>
									<span className="font-bold text-lg pr-2">
										{formatAmount("inr", selectedVariant?.price || 0)}
									</span>
									{selectedVariant?.maxPrice && (
										<span className="text line-through text-muted-foreground pr-2">
											{formatAmount("inr", selectedVariant?.maxPrice)}
										</span>
									)}
									{discount > 0 && (
										<Badge variant="info">{discount}% OFF</Badge>
									)}
								</div>
							</div>
							<AddToCart
								product={{
									...selectedVariant,
									quantity: null,
									thumbnail: product.thumbnail || "",
									title: product.title || "",
									storeHandle: storeHandle || "",
									storeName: "",
								}}
								variant="primary"
							/>
						</div>
					)}
				</div>
			)}

			{isFetching && <Spinner />}
		</div>
	);
}
