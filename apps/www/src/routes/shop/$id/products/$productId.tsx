import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";

import ImageCarousel from "@lipy/web-ui/components/custom-ui/imageCarousel";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@lipy/web-ui/components/ui/card";
import Loading from "@lipy/web-ui/components/ui/loading";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/shop/$id/products/$productId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { productId } = Route.useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProductData = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`https://dummyjson.com/products/${productId}`,
				);
				const data = await response.json();
				setProduct(data);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchProductData();
	}, []);

	// Format price to show only two decimal places when needed
	const originalPrice = (product) => {
		const originalPrice = product.discountPercentage
			? Math.round(product.price / (1 - product.discountPercentage / 100))
			: null;
		return originalPrice % 1 === 0 ? originalPrice : originalPrice.toFixed(2);
	};
	console.log(product);

	if (loading)
		return (
			<div>
				<Loading />
			</div>
		);
	return (
		<>
			<DashboardHeader title={product?.title || ""} />

			<Card className="p-4 shadow-none m-4 ">
				<ImageCarousel images={product?.images} />
				<Separator />
				<div className="space-y-2">
					<p className="text-lg font-semibold ">{product.title}</p>

					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground">
								{product.minimumOrderQuantity} kg
							</p>

							<span className="font-semibold text-lg pr-2">
								{" "}
								₹{product.price}
							</span>
							{originalPrice && (
								<span className="text-xs line-through text-muted-foreground">
									₹{originalPrice(product)}
								</span>
							)}
						</div>

						<Button
							variant={"secondary"}
							className="font-bold text-primary text-lg px-8 border-2 border-muted-foreground/10 shadow-sm"
						>
							ADD
						</Button>
					</div>
				</div>
			</Card>
			<Card className="p-4 shadow-none m-4 ">
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="item-1" className="border-b-0 -my-4">
						<AccordionTrigger className="font-semibold text-muted-foreground text-lg">
							Description
						</AccordionTrigger>
						<AccordionContent className="font-semibold text-sm text-muted-foreground/100">
							{product.description}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</Card>
		</>
	);
}
