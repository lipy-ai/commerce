import { publicShopApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import type { STORE_TYPE } from "@lipy/server/db/schema";
import { ScrollingTabs } from "@lipy/web-ui/components/custom-ui/scrollable-tabs";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import Loading from "@lipy/web-ui/components/ui/loading";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  BrickWall,
  BriefcaseMedical,
  Coffee,
  MapPin,
  Search,
  Star,
  Utensils,
} from "lucide-react";
import { Cherry, ShoppingBasket, Store } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "all", name: "All Stores", icon: Store },
  { id: "grocery", name: "Grocery", icon: ShoppingBasket },
  { id: "pharmacy", name: "Pharmacy", icon: BriefcaseMedical },
  { id: "fruits_and_vegetables", name: "Fruits & Vegetables", icon: Cherry },
  { id: "restaurant", name: "Restaurant", icon: Utensils },
  { id: "cafe", name: "Cafe", icon: Coffee },
  { id: "hardware", name: "Hardware", icon: BrickWall },
];

export default function NearByShops() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { isMobile } = useViewport();
  const { data: shops, isFetching } = useAPIQuery(
    publicShopApi.index,
    "$get",
    {
      query: {
        type: activeCategory as (typeof STORE_TYPE)[number] | "all",
      },
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      cacheTime: Number.POSITIVE_INFINITY,
      placeholderData: (p) => p,
      // enabled: activeCategory !== "all",
    }
  );

  return (
    <>
      {isMobile ? (
        <div className=" border-b sticky top-0 z-50 bg-card  overflow-hidden shadow-xs">
          <div className="relative z-10 space-y-2">
            <div className="px-4 py-2">
              <Link
                className={cn(
                  buttonVariants({ variant: "tertiary" }),
                  "w-full justify-start text-muted-foreground border bg-tertiary/50d"
                )}
                to="/"
              >
                <Search />
                Search for stores near you
              </Link>
            </div>

            <div>
              <ScrollingTabs
                tabs={CATEGORIES}
                handleTabChange={setActiveCategory}
                className="text-foreground "
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 bg-background border-b">
          <div className="bg-accent/20 px-12">
            <ScrollingTabs
              tabs={CATEGORIES}
              handleTabChange={setActiveCategory}
              className="text-foreground"
            />
          </div>
        </div>
      )}

      {isFetching ? (
        <Loading />
      ) : !shops || shops.length === 0 ? (
        <EmptyPage
          title="Coming soon to your doorstep!"
          label="We are currently not available at your location. We will be in your
					service soon."
        >
          <img
            src="/assets/online-shopping-store.png"
            alt=""
            className="aspect-square object-cover size-40"
          />
        </EmptyPage>
      ) : (
        <div>
          <div className="m-auto max-w-screen-2xl px-2 ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4 py-4">
              {shops.map((shop) => (
                <div key={shop.id} className="space-y-6">
                  <div className="bg-card border p-0 rounded-xl border-accent">
                    <Link
                      to="/$storeHandle"
                      params={{ storeHandle: shop.handle as string }}
                    >
                      <div className="relative h-44">
                        <img
                          src={shop.image || "/assets/paper-bag-items.webp"}
                          alt={shop.name}
                          className="w-full h-full object-cover rounded-t-xl"
                        />

                        <Badge
                          className="absolute bottom-3 right-3"
                          variant={"secondary"}
                        >
                          <div className="flex items-center">
                            <MapPin className="size-4 mr-1" />
                            <span>1 km</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="p-4 -my-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-xl">{shop.name}</h3>

                          <div className="flex items-center mt-1">
                            <div className="flex items-center bg-green-800 text-background px-2 rounded text-sm">
                              <span>4.6</span>
                              <Star className="h-3 w-3 ml-1 fill-white" />
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-muted-foreground capitalize">
                          {shop?.type?.replace("_", " ")}
                        </div>

                        <div className="flex items-center justify-between mt-3 text-sm" />
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
