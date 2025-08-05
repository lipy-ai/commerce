import { env } from "@envClient";
import { publicShopApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lipy/web-ui/components/ui/dropdown-menu";
import Loading from "@lipy/web-ui/components/ui/loading";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { shareContent } from "@lipy/web-ui/lib/share";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import type { InferResponseType } from "hono/client";
import {
  ChevronRight,
  EllipsisVertical,
  Info,
  Search,
  Share,
} from "lucide-react";
import { useState } from "react";
import { PrimaryCartFooter } from "@/components/cart/cartFooter";
import ProductCard from "@/components/productCard";
import { StoreNav } from "./-nav";
import { StoreHeroSection } from "./-storeHeroSection";

export const Route = createFileRoute("/(default)/(store)/$storeHandle/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { storeHandle } = Route.useParams();
  const { scrollY } = useScroll();
  const [visibleShopName, setVisibleShopName] = useState(false);
  const { isMobile } = useViewport();
  useMotionValueEvent(scrollY, "change", (current) => {
    if (current > 24) {
      setVisibleShopName(true);
    } else {
      setVisibleShopName(false);
    }
  });

  const {
    data: shopData,
    isFetching: fetchingShopData,
    isFetched: fetchedShopData,
  } = useAPIQuery(
    publicShopApi[":handle"],
    "$get",
    {
      param: { handle: storeHandle },
    },
    {
      placeholderData: (p) => p,
    }
  );

  const {
    data: productData,
    isFetched: fetchedProduct,
    isFetching: fetchingProduct,
  } = useAPIQuery(
    publicShopApi[":storeHandle"].categories,
    "$get",
    {
      param: {
        storeHandle: storeHandle,
      },
      query: {
        limit: "10",
        page: "1",
      },
    },
    {
      staleTime: Number.POSITIVE_INFINITY,
      cacheTime: Number.POSITIVE_INFINITY,
      placeholderData: (p) => p,
    }
  );

  if (fetchingShopData || fetchingProduct) return <Loading />;

  return (
    <>
      <DashboardHeader
        titleChildren={
          <motion.h1
            className="font-semibold text-lg line-clamp-1"
            initial={{ opacity: 0, y: 20 }}
            animate={
              visibleShopName ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {shopData?.name}
          </motion.h1>
        }
        className="bg-card shadow-none border-b-0 lg:hidden"
      >
        {visibleShopName && (
          <Link
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "rounded-full border-none"
            )}
            to="/$storeHandle/products/search"
            params={{ storeHandle }}
          >
            <Search className="size-5 stroke-2" />
          </Link>
        )}

        {shopData && <ShopOptions shop={shopData} />}
      </DashboardHeader>
      <StoreNav storeHandle={storeHandle}>
        {fetchedShopData && shopData && isMobile && (
          <StoreHeroSection storeInfo={shopData} />
        )}

        {fetchedProduct && productData && productData.items.length > 0 && (
          <div className="mb-32  bg-card my-2 px-4 lg:px-8">
            {productData.items.map((productGroup, _idx) => {
              const productArray = productGroup.products;

              return (
                <div key={_idx} className="">
                  <p className="text-xl font-bold my-4">{productGroup.title}</p>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 lg:gap-x-6 gap-y-6 w-full">
                    {productArray?.map((product) => (
                      <div key={product.id}>
                        <ProductCard
                          product={product}
                          className={{
                            classNameImg: "aspect-square h-full",
                            classNameBox: "w-full h-full",
                          }}
                          storeHandle={storeHandle}
                          storeId={shopData?.id}
                        />
                      </div>
                    ))}
                  </div>
                  {productArray.length === 6 && (
                    <Link
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          className: "w-full my-2 font-semibold",
                        })
                      )}
                      to="/$storeHandle/products/category/$categorySlug"
                      params={{
                        storeHandle,
                        categorySlug: productGroup.slug as string,
                      }}
                    >
                      See more products
                      <ChevronRight />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {fetchedProduct && productData && productData.items.length === 0 && (
          <div className="flex flex-1 flex-col justify-center items-center  m-auto  text-center space-y-2">
            <img
              src="/assets/no-results-found.png"
              alt="no-result-found"
              className="size-54 lg:size-64 object-cover"
            />
            <p className="font-medium text-lg">No products found</p>
          </div>
        )}
      </StoreNav>

      <div className="lg:hidden">
        <PrimaryCartFooter />
      </div>
    </>
  );
}

export function ShopOptions({
  shop,
}: {
  shop: InferResponseType<(typeof publicShopApi)[":handle"]["$get"]>;
}) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-none"
        >
          <EllipsisVertical className="size-5 stroke-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px] space-y-3 mr-2">
        <DropdownMenuItem
          onClick={() => {
            shareContent({
              title: shop?.name,
              text: "Hey, Check out this shop!",
              url: `${env.WEB_URL}/${shop?.handle}`,
            });
          }}
        >
          <Share />
          Share the shop
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            navigate({
              to: "/$storeHandle/details",
              params: {
                storeHandle: shop.handle as string,
              },
            })
          }
        >
          <Info />
          View shop details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
