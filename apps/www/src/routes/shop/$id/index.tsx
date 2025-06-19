import ProductCard from "@/components/productCard"; // Fixed the path
import { ShopHeroPage } from "@/components/shop/shopHeroSection";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/shop/$id/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const { data, isFetched, isFetching } = useAPIQuery(
		apiClient.v1.products,
		"$get",
		{
			query: {
				shopId: id,
			},
		},
	);

	const router = useRouter();

	const groupedProducts = [];

	if (isFetched) {
		const categoryMap = new Map();

		for (const product of data || []) {
			const { categoryId, categoryTitle } = product;

			if (!categoryMap.has(categoryId)) {
				categoryMap.set(categoryId, {
					categoryId,
					categoryTitle,
					products: [],
				});
			}

			categoryMap.get(categoryId).products.push(product);
		}

		// Convert map to array
		for (const group of categoryMap.values()) {
			groupedProducts.push(group);
		}
	}

	return (
		<div className="relative">
			<ShopHeroPage />

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
					groupedProducts.map((productGroup, _idx) => {
						const categoryName = productGroup.categoryTitle;
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
										to={"/shop/$id/products/category/$categoryId"}
										params={{ id: id, categoryId: productGroup.categoryId }}
									>
										View All
										<ChevronRight />
									</Link>
								</div>

								<div
									className="flex overflow-x-auto flex-nowrap  scrollbar-hide w-full"
									style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
								>
									{productArray?.map((product: any) => (
										<div
											key={product.id}
											onClick={() =>
												router.navigate({
													to: `/shop/${id}/products/${product.id}`,
												})
											}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													router.navigate({
														to: `/shop/${id}/products/${product.id}`,
													});
												}
											}}
										>
											<ProductCard
												thumbnail={product.thumbnail}
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

			{!isFetching && groupedProducts.length === 0 && (
				<div className="my-32">
					<EmptyPage />
				</div>
			)}

			{/* <Separator /> */}
			{/* <div className="px-2 pt-12 pb-28 bg-accent space-y-4 absolute bottom-0 left-0 right-0">
				<h1 className="text-5xl text-muted-foreground/40 font-bold">
					Empowering local shops
					<Heart className="inline-block ml-2 size-10 fill-red-400 text-red-400" />
				</h1>
				<Separator className="bg-muted-foreground/40" />
				<h3 className="text-muted-foreground/40 text-lg font-bold">
					connecting with love by LIPY
				</h3>
			</div> */}
		</div>
	);
}
