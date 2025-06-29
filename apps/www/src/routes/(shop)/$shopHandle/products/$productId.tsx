import { AddToCart } from "@/components/cart/addToCart";
import { apiClient } from "@lipy/lib/api";
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
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/(shop)/$shopHandle/products/$productId")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const { productId } = Route.useParams();

	const {
		data: product,
		isFetching,
		isFetched,
	} = useAPIQuery(apiClient.v1.products[":id"], "$get", {
		param: {
			id: productId,
		},
	});

	// Define a type for the product variant
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

	if (isFetching) return <Spinner />;

	if (!product) return <div>Product not found.</div>;

	return (
		<div className="mb-20">
			<DashboardHeader title={product.title || ""} />

			<ImageCarousel images={product.images || []} />
			<Separator className="my-2" />

			{product.variants?.length > 0 && (
				<div className="grid grid-cols-4 lg:grid-cols-8 gap-x-2 gap-y-2 px-4">
					{product.variants.map((variant) => (
						<div
							key={variant.id}
							className={cn(
								"cursor-pointer p-1 rounded",
								selectedVariant?.id === variant.id
									? "ring-2 ring-primary bg-primary/10"
									: "hover:bg-accent/30",
							)}
							onClick={() => setSelectedVariant(variant)}
						>
							<img
								src={variant.thumbnail || product.thumbnail || ""}
								alt={variant.title || product.title || ""}
								className="aspect-square border rounded bg-accent object-cover"
							/>
							<p className="line-clamp-1 text-sm mt-1 text-center">
								{variant.title}
							</p>
						</div>
					))}
				</div>
			)}

			<div className="border border-dashed my-4" />

			{selectedVariant && (
				<div className="space-y-2 p-4">
					<p className="text-lg font-semibold">{selectedVariant.title}</p>

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
						<AddToCart product={selectedVariant} variant="primary" />
					</div>
				</div>
			)}

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
									className="flex items-center justify-between"
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
		</div>
	);
}
