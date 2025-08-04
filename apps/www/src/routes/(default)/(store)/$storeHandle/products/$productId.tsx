import { publicProductApi, publicShopApi } from "@lipy/lib/api";
import { discountCalculator } from "@lipy/lib/helper/discountCalculator";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import ImageCarousel from "@lipy/web-ui/components/custom-ui/imageCarousel";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Label } from "@lipy/web-ui/components/ui/label";
import Loading from "@lipy/web-ui/components/ui/loading";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { shareContent } from "@lipy/web-ui/lib/share";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { Share } from "lucide-react";
import { useEffect, useState } from "react";
import { AddToCart } from "@/components/cart/addToCart";
import { StoreNav } from "../-nav";

export const Route = createFileRoute(
  "/(default)/(store)/$storeHandle/products/$productId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { productId, storeHandle } = Route.useParams();
  const { isMobile } = useViewport();

  const { data: storeInfo, isLoading: isStoreLoading } = useAPIQuery(
    publicShopApi[":handle"],
    "$get",
    { param: { handle: storeHandle } }
  );

  const { data: product, isLoading } = useAPIQuery(
    publicProductApi.singleProduct,
    "$get",
    {
      query: {
        productId,
        handle: storeHandle,
      },
    },
    {
      enabled: !!storeInfo?.id,
    }
  );

  type ProductResponse = InferResponseType<
    typeof publicProductApi.singleProduct.$get
  >;
  type ProductVariant = ProductResponse extends { variants: Array<infer V> }
    ? V
    : unknown;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();

  useEffect(() => {
    if (!isLoading && product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [isLoading, product?.variants]);

  const discount = discountCalculator(
    selectedVariant?.price || 0,
    selectedVariant?.maxPrice || 0
  );

  return (
    <StoreNav storeHandle={storeHandle}>
      {isLoading || isStoreLoading ? (
        <Loading />
      ) : !product ? (
        <EmptyPage
          title="Product Not Found"
          label="The product you are looking for does not exist or has been removed."
        />
      ) : (
        <div>
          <DashboardHeader title={product.title || ""}>
            <Button
              onClick={() => {
                shareContent({
                  title: product.title || "",
                  url: window.location.href,
                  text: "Hey, Check out this product!",
                });
              }}
              variant="outline"
              className="rounded-full border-none"
              size="icon"
            >
              <Share className="size-4 stroke-2" />
            </Button>
          </DashboardHeader>

          <div className="lg:grid lg:grid-cols-12  lg:p-8">
            <div className="lg:col-span-6 bg-card">
              <ImageCarousel images={product.images || []} />
            </div>

            <div className="lg:col-span-6 lg:p-4 lg:space-y-4 ">
              <div className="bg-card rounded-xl  mx-2 border border-border/40">
                <h3 className="font-bold text-lg px-4 pt-2">{product.title}</h3>
                {product.variants?.length === 1 ? (
                  <div className="px-4 py-2">
                    <p className="font-medium text-base">
                      {product.variants[0]?.unit}
                    </p>
                    <div>
                      <span className="font-semibold text-lg pr-2">
                        {formatAmount("inr", product.variants[0]?.price || 0)}
                      </span>
                      {product.variants[0]?.maxPrice && (
                        <span className="text line-through text-muted-foreground">
                          {formatAmount("inr", product.variants[0]?.maxPrice)}
                        </span>
                      )}
                      {discount > 0 && (
                        <Badge variant="info">{discount}% OFF</Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2">
                    <Label className="text-muted-foreground">
                      Select variant
                    </Label>
                    <div
                      className="overflow-x-auto py-2 px-1 flex items-center gap-4"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {product.variants.map((variant) => (
                        <div
                          key={variant.inventoryId}
                          className={cn(
                            "cursor-pointer px-3 py-1 rounded-lg bg-muted/50",
                            selectedVariant?.id === variant.id
                              ? "ring-2 ring-primary bg-primary/10"
                              : ""
                          )}
                          onClick={() => setSelectedVariant(variant)}
                        >
                          <p className="line-clamp-1 text-sm mt-1 text-center">
                            {variant.unit}
                          </p>
                          <div>
                            <span className="font-semibold text-lg pr-2">
                              {formatAmount("inr", variant.price || 0)}
                            </span>
                            {variant.maxPrice && (
                              <span className="text-xs line-through text-muted-foreground">
                                {formatAmount("inr", variant.maxPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVariant && (
                  <div
                    className={cn(
                      isMobile
                        ? "fixed bottom-0 left-0 right-0  bg-card shadow-xl border-t border-border/50"
                        : "bg-accent/30"
                    )}
                  >
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{selectedVariant?.unit}</p>
                        <div>
                          <span className="font-bold text-lg pr-2">
                            {formatAmount("inr", selectedVariant?.price || 0)}
                          </span>
                          {selectedVariant?.maxPrice && (
                            <span className="text line-through text-muted-foreground pr-2">
                              {formatAmount("inr", selectedVariant?.maxPrice)}
                            </span>
                          )}
                          {discount > 0 && (
                            <Badge variant="info">{discount}% OFF</Badge>
                          )}
                        </div>
                      </div>
                      {selectedVariant?.inStock ? (
                        <AddToCart
                          product={{
                            inventoryId: selectedVariant?.inventoryId as string,
                            quantity: 1,
                          }}
                          variant="secondary"
                          activeVariant="secondary-active"
                        />
                      ) : (
                        <Button disabled>Out of stock</Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {product?.highlights && product?.highlights?.length > 0 && (
                <Accordion
                  type="single"
                  collapsible
                  className="bg-card rounded-xl m-2 mb-36 lg:border  border-border/40"
                  defaultValue="item-1"
                >
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="hover:no-underline font-medium text-base px-6">
                      Basic details
                    </AccordionTrigger>

                    <AccordionContent className="px-6 pb-6 space-y-4">
                      {product.highlights.map((highlight) => (
                        <div
                          key={highlight.name}
                          className="flex items-start justify-between"
                        >
                          <span className="font-normal flex-1">
                            {highlight.name}
                          </span>
                          <span className="text-foreground/80 flex-1 text-left">
                            {highlight.value}
                          </span>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </div>
        </div>
      )}
    </StoreNav>
  );
}
