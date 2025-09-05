import StoreCard from "@/components/shops/storeCard";
import { publicProductApi, publicSearchApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import z from "zod";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { useCanGoBack } from "@tanstack/react-router";
import { Button } from "@lipy/web-ui/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/(default)/search")({
  component: RouteComponent,
  validateSearch: z.object({
    q: z.string().default(""),
  }),
});

function RouteComponent() {
  const { q } = Route.useSearch();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const onBack = (e: any) => {
    e.preventDefault();
    canGoBack ? router.history.back() : router.navigate({ to: "/" });
    return false;
  };

  const { data, isLoading } = useAPIQuery(publicSearchApi.index, "$get", {
    query: {
      q: q,
    },
  });

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8 w-full">
      <div className="flex gap-2 w-full flex-1">
        <Button
          className="size-12"
          variant={"outline"}
          size={"icon"}
          onClick={onBack}
        >
          <ArrowLeft />
        </Button>
        <div className="flex-1">
          <SearchBar className="w-full sm:h-12" placeholder="Search shops" />
        </div>
      </div>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-video" />
          ))}
        </div>
      ) : data?.length === 0 ? (
        <div>
          <EmptyPage
            title="No stores found."
            label="We could'nt find any shops based on your search query."
            className="bg-muted/60 py-12 rounded-2xl"
          >
            <img
              src="/assets/no-results-found.png"
              alt=""
              className="aspect-square object-cover size-40 mb-8"
            />
          </EmptyPage>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {data?.map((shop) => (
            <div key={shop.id} className="space-y-6">
              <StoreCard data={shop} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
