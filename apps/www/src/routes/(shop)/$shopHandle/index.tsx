import ProductCard from "@/components/productCard"; // Fixed the path
import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@lipy/web-ui/components/ui/dropdown-menu";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { shareContent } from "@lipy/web-ui/lib/share";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import type { InferResponseType } from "hono/client";
import { ChevronRight, EllipsisVertical, Info, Share } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/(shop)/$shopHandle/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { shopHandle } = Route.useParams();
	const { scrollY } = useScroll();
	const [visibleShopName, setVisibleShopName] = useState(false);
	useMotionValueEvent(scrollY, "change", (current) => {
		if (current > 24) {
			setVisibleShopName(true);
		} else {
			setVisibleShopName(false);
		}
	});

	const {
		data: shopData,
		isFetching: fetchingShopData,
		isFetched: fetchedShopData,
	} = useAPIQuery(
		apiClient.v1.shops[":handle"],
		"$get",
		{
			param: { handle: shopHandle },
		},
		{
			staleTime: Number.POSITIVE_INFINITY,
			cacheTime: Number.POSITIVE_INFINITY,
		},
	);

	const { data: productData, isFetched: fetchedProduct } = useAPIQuery(
		apiClient.v1.shops[":id"].categories,
		"$get",
		{
			param: {
				id: shopData?.id as string,
			},
			query: {
				limit: "10",
				page: "1",
			},
		},
		{
			enabled: !!shopData?.id,
		},
	);

	console.log("Product data", productData);

	return (
		<div className="relative max-w-screen-lg mx-auto">
			<DashboardHeader
				titleChildren={
					<motion.h1
						className="font-semibold text-lg line-clamp-1"
						initial={{ opacity: 0, y: 20 }}
						animate={
							visibleShopName ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
						}
						transition={{ duration: 0.5, ease: "easeInOut" }}
					>
						{shopData?.name}
					</motion.h1>
				}
				className={cn(
					!visibleShopName ? "bg-amber-100" : "bgg-card",
					"lg:hidden border-0 h-12",
				)}
			>
				{shopData && <ShopOptions shop={shopData} />}
			</DashboardHeader>

			<div className="px-4 pb-4 bg-amber-100">
				{fetchingShopData && <Skeleton className="h-16 w-full" />}
				{fetchedShopData && shopData && (
					<div className="text-center mb-2">
						<Link
							className="text-2xl font-bold "
							to="/$shopHandle/details"
							params={{ shopHandle }}
						>
							{shopData.name}
						</Link>
						<div className="mt-2 text-sm text-muted-foreground">
							Books • Stationary
						</div>
					</div>
				)}
			</div>

			<div>
				{fetchedProduct && productData && productData.items.length > 0 && (
					<div className="border border-t-0 rounded-b-xl grid grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4 p-4 bg-amber-100">
						{productData.items.map((item) => (
							<Link
								key={item.id}
								className="text-center"
								to="/$shopHandle/products/category/$categoryId"
								params={{ shopHandle, categoryId: item.id }}
							>
								<img
									src={"./assets/maggy.jpeg"}
									alt={item?.title || ""}
									className="rounded-xl aspect-square bg-gray-200"
								/>
								<p className="text-xs font-medium line-clamp-1">
									{item?.title}
								</p>
							</Link>
						))}
					</div>
				)}
				{fetchedProduct &&
					productData &&
					productData.items.length > 0 &&
					productData.items.map((productGroup, _idx) => {
						const productArray = productGroup.products;

						return (
							<div key={_idx} className="my-10 mx-4">
								<p className="text-xl font-bold my-4">{productGroup.title}</p>

								<div className="grid grid-cols-3 lg:grid-cols-4  gap-x-4 gap-y-6 w-full">
									{productArray?.map((product: any) => (
										<Link
											key={product.id}
											to="/$shopHandle/products/$productId"
											params={{ shopHandle, productId: product.id }}
										>
											<ProductCard
												product={product}
												className={{
													classNameImg: "aspect-square h-full",
													classNameBox: "w-full h-full",
												}}
											/>
										</Link>
									))}
								</div>
								{productArray.length === 6 && (
									<Link
										className={cn(
											buttonVariants({
												variant: "blue-soft",
												className: "w-full my-2 font-semibold",
											}),
										)}
										to="/$shopHandle/products/category/$categoryId"
										params={{
											shopHandle,
											categoryId: productGroup.id,
										}}
									>
										See more products
										<ChevronRight />
									</Link>
								)}
							</div>
						);
					})}

				{fetchedProduct && productData && productData.items.length === 0 && (
					<EmptyPage
						title="No products found"
						label="This shop has no products yet."
					/>
				)}
			</div>
		</div>
	);
}

function ShopOptions({
	shop,
}: {
	shop: InferResponseType<typeof apiClient.v1.shops.$get>[number];
}) {
	const navigate = useNavigate();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<EllipsisVertical className="size-4 stroke-2" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="min-w-[200px] space-y-3 mr-2">
				<DropdownMenuItem
					onClick={() => {
						shareContent({
							title: shop?.name,
							text: "Hey, Check out this shop!",
							url: `${env.WEB_URL}/${shop?.handle}`,
						});
					}}
				>
					<Share />
					Share the shop
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() =>
						navigate({
							to: "/$shopHandle/details",
							params: {
								shopHandle: shop.handle as string,
							},
						})
					}
				>
					<Info />
					View shop details
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
