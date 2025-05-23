import ShopShortDetails from "@/components/shop/shopShortDetails";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import ProductCard from "@lipy/web-ui/components/product/productCard"; // Fixed the path
import SearchBar from "@lipy/web-ui/components/searchBar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/shop/$id/")({
	component: RouteComponent,
});

const shopInfo = {
	id: 1,
	name: "Tasty Bites Restaurant",
	address: "123 Main Street, Downtown, City",
	rating: 4.7,
	reviews: 328,
	isOpen: true,
	deliveryTime: "25-35",
};

function RouteComponent() {
	const [categories, setCategories] = useState<string[]>([]);
	const [products, setProducts] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [shopInfoVisible, setShopInfoVisible] = useState(true);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setIsLoading(true);
				const res = await fetch("https://dummyjson.com/products/categories");
				const data: string[] = await res.json();
				setCategories(data);

				// Fetch products for all categories
				const productsData = await Promise.all(
					data.map(async (category: string) => {
						const res = await fetch(`${category.url}?limit=6`);
						const json = await res.json();
						return {
							[category.name]: json.products, // key: category, value: product array
						};
					}),
				);

				// Result is array of objects; merge them into one array of objects if needed
				setProducts(productsData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategories();
	}, []);

	// if (isLoading) return <Loading />;

	return (
		<>
			<DashboardHeader
				titleChildren={
					<motion.div
						key={shopInfoVisible ? "empty" : "title"}
						initial={{ opacity: 0, y: 10 }} // Start slightly lower
						animate={{ opacity: 1, y: 0 }} // Move to normal position
						exit={{ opacity: 0, y: -10 }} // Exit upward
						transition={{ duration: 0.3 }}
						className="text-lg font-semibold line-clamp-1"
					>
						{!shopInfoVisible ? shopInfo.name : ""}
					</motion.div>
				}
			/>

			<motion.div
				onViewportEnter={() => setShopInfoVisible(true)}
				onViewportLeave={() => setShopInfoVisible(false)}
				className="mb-4"
			>
				<ShopShortDetails shopInfo={shopInfo} />
			</motion.div>

			<Separator className="-my-4" />

			{isLoading &&
				[...Array(3)].map((_, i) => (
					<div key={i} className="flex items-center gap-4 m-6">
						<Skeleton className=" w-1/3 h-36" />
						<Skeleton className="w-1/3 h-36" />
						<Skeleton className="w-1/3 h-36" />
					</div>
				))}

			<div className="mb-16">
				{!isLoading &&
					products &&
					products.length > 0 &&
					products.map((productGroup, idx) => {
						const categoryName = Object.keys(productGroup)[0];
						const productArray = Object.values(productGroup)[0];

						return (
							<div key={categoryName} className="my-10">
								<div className="flex items-center justify-between">
									<p className="text-lg font-semibold px-4 my-4">
										{categoryName}
									</p>

									<Link
										className={cn(
											buttonVariants({ variant: "link", size: "sm" }),
										)}
										to={`/shop/${shopInfo.id}/products/category/${categoryName}`}
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
										<Link
											key={product.id}
											to={`/shop/$id/products/${product.id}`}
										>
											<ProductCard
												product={product}
												className={cn(
													index === 0
														? "pl-4"
														: index === productArray.length - 1
															? "pr-4"
															: "",
													"flex-shrink-0 w-32 pl-4",
												)}
											/>
										</Link>
									))}
								</div>
							</div>
						);
					})}
			</div>

			{!isLoading && products.length === 0 && <EmptyPage />}

			<div className="fixed bottom-0 p-4 w-full bg-accent">
				<SearchBar placeholder={`Search in ${shopInfo.name}`} />
			</div>
		</>
	);
}
