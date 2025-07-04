import ProductCard, { type ProductType } from "@/components/productCard";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(store)/$storeHandle/products/category/$categorySlug",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { storeHandle, categorySlug } = Route.useParams();

	const { data, isFetching, isFetched } = useAPIQuery(
		apiClient.v1.products,
		"$get",
		{
			query: {
				storeHandle: storeHandle,
				categorySlug: categorySlug,
			},
		},
	);

	return (
		<div className="[view-transition-name:main-content]">
			{isFetched && data && data.length > 0 && (
				<div className="max-w-screen-lg mx-auto">
					<DashboardHeader title={data[0].categoryTitle || ""} />
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 space-y-4 p-4 mb-20">
						{data.map((product) => (
							<div key={product.id}>
								<ProductCard
									product={product as ProductType}
									className={{ classNameImg: "h-full" }}
									storeHandle={storeHandle}
								/>
							</div>
						))}
					</div>
				</div>
			)}

			{isFetching && <Spinner />}
		</div>
	);
}
