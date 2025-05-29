import ProductCard from "@/components/productCard";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/shop/$id/products/category/$categoryId")(
	{
		component: RouteComponent,
	},
);

function RouteComponent() {
	const { id, categoryId } = Route.useParams();
	const router = useRouter();

	const [title, setTitle] = useState("");

	const { data, isFetched, isFetching, error } = useAPIQuery(
		apiClient.v1.products,
		"$get",
		{
			query: {
				category_id: categoryId,
			},
		},
	);

	useEffect(() => {
		if (isFetched) {
			setTitle(data[0]?.category_title);
		}
	}, [isFetched]);

	return (
		<>
			<DashboardHeader title={title} />
			{isFetching &&
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

			{isFetched && !error && data && data.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 space-y-4 p-4">
					{data.map((product) => (
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
								product={product.variants[0]}
								className={{ classNameImg: "h-44" }}
							/>
						</div>
					))}
				</div>
			)}
		</>
	);
}
