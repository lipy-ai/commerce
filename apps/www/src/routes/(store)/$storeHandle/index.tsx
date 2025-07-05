import ProductCard from "@/components/productCard"; // Fixed the path
import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Avatar, AvatarFallback } from "@lipy/web-ui/components/ui/avatar";
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

export const Route = createFileRoute("/(store)/$storeHandle/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { storeHandle } = Route.useParams();
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
			param: { handle: storeHandle },
		},
		{
			staleTime: Number.POSITIVE_INFINITY,
			cacheTime: Number.POSITIVE_INFINITY,
		},
	);

	const {
		data: productData,
		isFetched: fetchedProduct,
		isFetching: fetchingProduct,
	} = useAPIQuery(
		apiClient.v1.shops[":storeHandle"].categories,
		"$get",
		{
			param: {
				storeHandle: storeHandle,
			},
			query: {
				limit: "10",
				page: "1",
			},
		},
		{
			staleTime: Number.POSITIVE_INFINITY,
			cacheTime: Number.POSITIVE_INFINITY,
		},
	);

	if (fetchingShopData || fetchingProduct) return <ShopLoadingSkeleton />;
	return (
		<div className="relative max-w-screen-lg mx-auto [view-transition-name:main-content]">
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
				className={cn(!visibleShopName ? "bg-amber-100 border-b-0" : "bg-card")}
			>
				{shopData && <ShopOptions shop={shopData} />}
			</DashboardHeader>

			{fetchedShopData && shopData && (
				<div className="text-center  bg-amber-100 p-4">
					<Link
						className="text-2xl font-bold "
						to="/$storeHandle/details"
						params={{ storeHandle }}
						viewTransition={{ types: ["slide-left"] }}
					>
						{shopData.name}
					</Link>
					<div className="mt-2 text-sm text-muted-foreground">
						Books • Stationary
					</div>
				</div>
			)}

			{fetchedProduct && productData && productData.items.length > 0 && (
				<div className="border border-t-0 rounded-b-xl grid grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8  bg-amber-100 p-4">
					{productData.items.map((item) => (
						<Link
							key={item.id}
							className="text-center"
							to="/$storeHandle/products/category/$categorySlug"
							params={{ storeHandle, categorySlug: item.slug as string }}
							viewTransition={{ types: ["slide-left"] }}
						>
							<div className="relative w-full aspect-square rounded-xl overflow-hidden  bg-accent">
								<img
									src={item?.image || "./assets/maggy.jpeg"}
									alt={item?.title || ""}
									className="rounded-xl aspect-square bg-gray-200"
								/>
							</div>

							<p className="font-medium line-clamp-1 text-sm">{item?.title}</p>
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

							<div className="grid grid-cols-2 lg:grid-cols-4  gap-x-4 gap-y-6 w-full">
								{productArray?.map((product) => (
									<div key={product.id}>
										<ProductCard
											product={product}
											className={{
												classNameImg: "aspect-square h-full",
												classNameBox: "w-full h-full",
											}}
											storeHandle={storeHandle}
										/>
									</div>
								))}
							</div>
							{productArray.length === 6 && (
								<Link
									className={cn(
										buttonVariants({
											variant: "outline",
											className: "w-full my-2 font-semibold",
										}),
									)}
									to="/$storeHandle/products/category/$categorySlug"
									params={{
										storeHandle,
										categorySlug: productGroup.slug as string,
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
				<Avatar>
					<AvatarFallback className="bg-card">
						<EllipsisVertical className="size-5 stroke-2" />
					</AvatarFallback>
				</Avatar>
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
							to: "/$storeHandle/details",
							params: {
								storeHandle: shop.handle as string,
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

function ShopLoadingSkeleton() {
	return (
		<div className="relative max-w-screen-lg mx-auto">
			<DashboardHeader
				titleChildren={<Skeleton className="h-6 w-32" />}
				className="bg-amber-100"
			>
				<Skeleton className="size-5" />
			</DashboardHeader>

			<div className="text-center bg-amber-100 p-4">
				<Skeleton className="h-8 w-48 mx-auto mb-2" />
				<Skeleton className="h-4 w-32 mx-auto" />
			</div>

			<div className="border border-t-0 rounded-b-xl grid grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8 bg-amber-100 p-4">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="text-center">
						<Skeleton className="w-full aspect-square rounded-xl mb-2" />
						<Skeleton className="h-3 w-full" />
					</div>
				))}
			</div>

			<div className="my-10 mx-4">
				<Skeleton className="h-6 w-40 my-4" />
				<div className="grid grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 w-full">
					{Array.from({ length: 6 }).map((_, j) => (
						<div key={j} className="w-full">
							<Skeleton className="aspect-square w-full rounded-lg mb-2" />
							<Skeleton className="h-4 w-full mb-1" />
							<Skeleton className="h-3 w-16" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
