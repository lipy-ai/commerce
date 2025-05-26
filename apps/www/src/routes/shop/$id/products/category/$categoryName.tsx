import ProductCard from "@/components/productCard";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute(
	"/shop/$id/products/category/$categoryName",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { categoryName, id } = Route.useParams();
	const router = useRouter();

	const label = categoryName.toLowerCase().split(" ").join("-");

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProductData = async () => {
			setLoading(true);
			try {
				const response = await fetch(
					`https://dummyjson.com/products/category/${label}`,
				);
				const data = await response.json();
				setProducts(data.products); // Fix: Use data.products
			} catch (err) {
				setError(err); // Fix: Use caught error
			} finally {
				setLoading(false);
			}
		};

		fetchProductData();
	}, [label]); // Fix: Add label to dependency array

	return (
		<>
			<DashboardHeader title={categoryName} />

			{loading &&
				!error &&
				[...Array(5)].map((_, index) => (
					<div
						key={index}
						className="my-2 flex  items-center gap-4 justify-between"
					>
						<Skeleton className="h-28 w-1/2" />
						<Skeleton className="h-28 w-1/2" />
					</div>
				))}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 space-y-4 p-4">
				{products.map((product) => (
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
							shopId={id}
							product={product}
							className={{ classNameImg: "h-44" }}
						/>
					</div>
				))}
			</div>
		</>
	);
}
