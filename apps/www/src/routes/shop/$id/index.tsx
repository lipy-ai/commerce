import ProductCard from "@/components/productCard"; // Fixed the path
import ShopShortDetails from "@/components/shop/shopShortDetails";
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
	const [products, setProducts] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [shopNameVisible, setShopNameVisible] = useState(false);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", (current) => {
		if (current > 30) {
			setShopNameVisible(true);
		} else {
			setShopNameVisible(false);
		}
	});

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setIsLoading(true);
				const res = await fetch("https://dummyjson.com/products/categories");
				const data: string[] = await res.json();

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

	const router = useRouter();

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
											"font-semibold text-sm",
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
												shopId={shopInfo.id}
												product={product}
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

			{!isLoading && products.length === 0 && <EmptyPage />}

			<div className="fixed bottom-0 p-4 w-full bg-accent">
				<SearchBar placeholder={`Search in ${shopInfo.name}`} />
			</div>
		</>
	);
}
