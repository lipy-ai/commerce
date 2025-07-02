import ProductCard, { type ProductType } from "@/components/productCard";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(shop)/$shopHandle/products/category/$categoryId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	// FIXME: Should not be any type.
	const { shopHandle, categoryId }: any = Route.useParams();

	const { data, isFetched, isFetching } = useAPIQuery(
		apiClient.v1.products,
		"$get",
		{
			query: {
				categoryId: categoryId,
			},
		},
	);

	if (isFetching) return <Spinner />;

	return (
		<>
			{isFetched && data && data.length > 0 && (
				<div className="max-w-screen-lg mx-auto">
					<DashboardHeader title={data[0].categoryTitle || ""} />
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 space-y-4 p-4 mb-20">
						{data.map((product) => (
							<Link
								key={product.id}
								to="/$shopHandle/products/$productId"
								params={{ shopHandle, productId: product.id }}
							>
								<ProductCard
									product={product}
									className={{ classNameImg: "h-full" }}
								/>
							</Link>
						))}
					</div>
				</div>
			)}
		</>
	);
}
