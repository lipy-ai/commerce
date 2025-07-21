import { PrimaryCartFooter } from "@/components/cart/cartFooter";
import ProductCard from "@/components/productCard"; // Fixed the path
import { StoreHeroSection } from "@/components/store/storeHeroSection";
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
import { shareContent } from "@lipy/web-ui/lib/share";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import type { InferResponseType } from "hono/client";
import {
  ArrowLeft,
  ChevronRight,
  EllipsisVertical,
  Info,
  Search,
  Share,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/(default)/(store)/$storeHandle/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { storeHandle } = Route.useParams();
  const { scrollY } = useScroll();
  const [visibleShopName, setVisibleShopName] = useState(false);
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
      staleTime: Number.POSITIVE_INFINITY,
      cacheTime: Number.POSITIVE_INFINITY,
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
    <div>
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

      <div className="lg:grid lg:grid-cols-12 lg:px-8 m-auto lg:divide-x">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 lg:px-2 lg:space-y-4 lg:py-4 lg:sticky lg:top-0 lg:self-start lg:h-screen lg:overflow-y-auto">
          <ArrowLeft
            className="size-9 cursor-pointer hidden lg:block"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          />
          {fetchedShopData && shopData && (
            <StoreHeroSection storeInfo={shopData} />
          )}
        </div>

        {/* Right Content */}
        <div className="mb-32 lg:col-span-9 lg:h-screen lg:overflow-y-auto px-4">
          {fetchedProduct && productData && productData.items.length > 0 ? (
            productData.items.map((productGroup, _idx) => {
              const productArray = productGroup.products;

              return (
                <div key={_idx} className="my-10">
                  <p className="text-xl font-bold my-4">{productGroup.title}</p>

                  <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-4 gap-y-6 w-full">
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
            })
          ) : (
            <div className="flex justify-center flex-col items-center m-auto flex-1 text-center">
              <img src={"/assets/no-product.png"} alt="no-product" />
              <p className="font-medium text-lg">No products found</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:hidden">
        <PrimaryCartFooter />
      </div>
    </div>
  );
}

export function ShopOptions({
  shop,
}: {
  shop: InferResponseType<typeof publicShopApi.index.$get>[number];
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
