import ProductCard from "@/components/productCard"; // Fixed the path
import ShopShortDetails from "@/components/shop/shopShortDetails";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import SearchBar from "@lipy/web-ui/components/searchBar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/shop/$id/")({
	component: RouteComponent,
});

const shopInfo = {
	id: "abcshop",
	name: "Tasty Bites Restaurant",
	address: "123 Main Street, Downtown, City",
	rating: 4.7,
	reviews: 328,
	isOpen: true,
	deliveryTime: "25-35",
};

function RouteComponent() {
	const [shopNameVisible, setShopNameVisible] = useState(false);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (current) => {
		if (current > 30) {
			setShopNameVisible(true);
		} else {
			setShopNameVisible(false);
		}
	});

	const { id } = Route.useParams();

	const { data, isFetched, isFetching } = useAPIQuery(
		apiClient.v1.products,
		"$get",
		{
			query: {
				shop_id: id,
			},
		},
	);

	const router = useRouter();

	const groupedProducts = [];

	if (isFetched) {
		const categoryMap = new Map();

		for (const product of data) {
			const { category_id, category_title } = product;

			if (!categoryMap.has(category_id)) {
				categoryMap.set(category_id, {
					category_id,
					category_title,
					products: [],
				});
			}

			categoryMap.get(category_id).products.push(product);
		}

		// Convert map to array
		for (const group of categoryMap.values()) {
			groupedProducts.push(group);
		}
	}

	return (
		<>
			<DashboardHeader
				titleChildren={
					<motion.div
						variants={{
							visible: { opacity: 1, y: 0 },
							hidden: { opacity: 0, y: 50 },
						}}
						animate={shopNameVisible ? "visible" : "hidden"}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="text-xl font-semibold line-clamp-1"
					>
						{shopNameVisible ? shopInfo.name : ""}
					</motion.div>
				}
			/>

			<div className="mb-4">
				<ShopShortDetails shopInfo={shopInfo} />
			</div>

			<Separator className="-my-4" />

			{isFetching &&
				[...Array(3)].map((_, i) => (
					<div key={i} className="flex items-center gap-4 m-6">
						<Skeleton className=" w-1/3 h-36" />
						<Skeleton className="w-1/3 h-36" />
						<Skeleton className="w-1/3 h-36" />
					</div>
				))}

			<div className="mb-16">
				{!isFetching &&
					groupedProducts &&
					groupedProducts.length > 0 &&
					groupedProducts.map((productGroup, idx) => {
						const categoryName = productGroup.category_title;
						const productArray = productGroup.products;

						return (
							<div key={categoryName} className="my-10">
								<div className="flex items-center justify-between">
									<p className="text-lg font-semibold px-4 my-4">
										{categoryName}
									</p>

									<Link
										className={cn(
											buttonVariants({ variant: "link", size: "sm" }),
											"font-semibold text-sm",
										)}
										to={`/shop/${id}/products/category/${productGroup.category_id}`}
									>
										View All
										<ChevronRight />
									</Link>
								</div>

								<div
									className="flex overflow-x-auto flex-nowrap  scrollbar-hide w-full"
									style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
								>
									{productArray?.map((product: any, index) => (
										<div
											key={product.id}
											onClick={() =>
												router.navigate({
													to: `/shop/${shopInfo.id}/products/${product.id}`,
												})
											}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													router.navigate({
														to: `/shop/${shopInfo.id}/products/${product.id}`,
													});
												}
											}}
										>
											<ProductCard
												product={product.variants[0]}
												className={{
													classNameBox: "flex-shrink-0 w-36 pl-4",
												}}
											/>
										</div>
									))}
								</div>
							</div>
						);
					})}
			</div>

			{!isFetching && groupedProducts.length === 0 && <EmptyPage />}
		</>
	);
}
