import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";

import ImageCarousel from "@lipy/web-ui/components/custom-ui/imageCarousel";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card } from "@lipy/web-ui/components/ui/card";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";

import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { Frown } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/shop/$id/products/$productId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { productId } = Route.useParams();

	const { data, isFetched, isFetching, error } = useAPIQuery(
		apiClient.v1.products[":id"],
		"$get",
		{
			param: {
				id: productId,
			},
		},
	);

	console.log(data);

	return (
		<>
			{/* {loading && !error && (
				<Spinner className="absolute top-1/2 left-1/2" size={"large"} />
			)}
			{error && (
				<p>
					<EmptyPage
						icon={Frown}
						title="Could not load your data"
						label={error}
					/>
				</p>
			)}
			{!loading && product && (
				<div>
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
				</div>
			)} */}
			{isFetching && <Spinner className="absolute top-1/2 left-1/2" />}
			{isFetched && !error && data && (
				<div>
					<DashboardHeader title={data.title || ""} />
				</div>
			)}
		</>
	);
}
