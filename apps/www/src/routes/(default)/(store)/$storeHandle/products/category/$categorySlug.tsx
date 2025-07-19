import { PrimaryCartFooter } from "@/components/cart/cartFooter";
import ProductCard, { type ProductType } from "@/components/productCard";
import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import Loading from "@lipy/web-ui/components/ui/loading";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(default)/(store)/$storeHandle/products/category/$categorySlug",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { storeHandle, categorySlug } = Route.useParams();

	const { data, isLoading } = useAPIQuery(
		apiClient.v1.products,
		"$get",
		{
			query: {
				storeHandle: storeHandle,
				categorySlug: categorySlug,
			},
		},
		{
			placeholderData: (p) => p,
		},
	);

	const { data: storeInfo } = useAPIQuery(
		apiClient.v1.shops[":handle"],
		"$get",
		{
			param: { handle: storeHandle },
		},
	);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : !data || data.length === 0 ? (
				<EmptyPage
					title="No Products Found"
					label="There are no products available in this category."
				/>
			) : (
				<div className="max-w-screen-xl mx-auto">
					<DashboardHeader
						title={data[0].categoryTitle || ""}
						className="lg:border-0 lg:bg-background"
					/>
					<div className="grid grid-cols-2 md:grid-cols-4  gap-4 lg:gap-6 space-y-4 p-4 mb-32">
						{data.map((product) => (
							<div key={product.id}>
								<ProductCard
									product={product as ProductType}
									className={{ classNameImg: "aspect-square h-full" }}
									storeHandle={storeHandle}
									storeId={storeInfo?.id as string}
								/>
							</div>
						))}
					</div>
					<div className="lg:hidden">
						<PrimaryCartFooter />
					</div>
				</div>
			)}
		</>
	);
}
