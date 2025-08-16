import { publicProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/(default)/search")({
  component: RouteComponent,
  validateSearch: z.object({
    q: z.string().default(""),
  }),
});

function RouteComponent() {
  const { q } = Route.useSearch();
  const { deliveryLocation } = useLocationStore();
  const { data, isFetching } = useAPIQuery(
    publicProductApi.search,
    "$get",
    {
      query: {
        q: q,
        lat: String(deliveryLocation?.lat),
        lng: String(deliveryLocation.lng),
      },
    },
    {
      enabled: !!q,
    }
  );

  console.log(data);
  return (
    <div className="p-4">
      <SearchBar
        className="w-full"
        fullPageSearch
        placeholder="Search your products"
      />
      <div className="mt-8">
        {!data && !q ? (
          <div>
            <h1>Search your products</h1>
          </div>
        ) : isFetching ? (
          <Spinner />
        ) : data && data.length === 0 ? (
          <div>No nearby shop sells '{q}'</div>
        ) : (
          <div className="divide-y divide-dashed">
            {data?.map((p, index) => (
              <Link
                key={index}
                className="flex items-start gap-3 py-6"
                to="/$storeHandle/products/$productId"
                params={{
                  storeHandle: p.handle as string,
                  productId: p.productId,
                }}
              >
                <img
                  src={p.thumbnail || ""}
                  alt={p.title || ""}
                  className="object-contain size-12 border rounded bg-card flex-shrink-0"
                />
                <div>
                  <p className="font-medium text-base line-clamp-1 break-words">
                    {p.title}
                  </p>
                  <p className="text-green-700">{p.name}</p>
                  <div className="flex items-center justify-between ">
                    <p className="font-light">{p.unit || ""}</p>
                    <p className="font-semibold bg-yellow-200 py-0.5 px-2">
                      {formatAmount("inr", p?.price || 0)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
