import { publicProductApi, publicShopApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { StoreNav } from "../-nav";

export const Route = createFileRoute(
  "/(default)/(store)/$storeHandle/products/search"
)({
  component: RouteComponent,
  validateSearch: z.object({
    q: z.string().default(""),
  }),
});

function RouteComponent() {
  const { storeHandle } = Route.useParams();
  const { q } = Route.useSearch();

  const { data: storeInfo } = useAPIQuery(publicShopApi[":handle"], "$get", {
    param: { handle: storeHandle },
  });

  const { data: products, isFetching } = useAPIQuery(
    publicProductApi[":id"].search,
    "$get",
    {
      param: {
        id: storeInfo?.id as string,
      },
      query: {
        q: q,
      },
    },

    {
      enabled: !!storeInfo?.id,
      placeholderData: (p) => p,
    }
  );

  return (
    <StoreNav storeHandle={storeHandle}>
      <DashboardHeader className="bg-background px-0" hideBackBtn>
        <SearchBar
          className="w-full pr-4"
          fullPageSearch
          placeholder={`Search in ${storeInfo?.name}`}
        />
      </DashboardHeader>

      <div>
        {isFetching ? (
          <ProductSkeleton />
        ) : !products || products.length === 0 ? (
          <p className="p-4 font-medium text-lg">No result found for "{q}"</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
            {products.map((product) => (
              <Link
                key={product.id}
                className="relative aspect-square rounded-xl overflow-hidden"
                to="/$storeHandle/products/$productId"
                params={{
                  storeHandle: storeHandle,
                  productId: product.id,
                }}
              >
                <img
                  alt={product.title || ""}
                  src={product.thumbnail || ""}
                  className="w-full h-full object-contain border border-border/40 bg-card "
                />
                <div className="absolute bottom-0 w-full px-2 py-1 bg-black/50 backdrop-blur-md text-white text-sm font-medium line-clamp-1">
                  {product.title}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StoreNav>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
      {[...Array(8)].map((m) => (
        <Skeleton key={m} className="h-36 md:h-54" />
      ))}
    </div>
  );
}
