import { loggedInCartApi } from "@lipy/lib/api";
// import PlaceOrder from "@/components/order/placeOrder";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
  apiQueryOptions,
  useAPIMutation,
  useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogHeader,
  DrawerDialogSwitcher,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@lipy/web-ui/components/ui/card";
import Loading from "@lipy/web-ui/components/ui/loading";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Dog,
  MapPin,
  MapPinned,
  MessageSquareText,
  Phone,
  ShoppingBag,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AddToCart } from "@/components/cart/addToCart";
import { type ProductInCart, useCartStore } from "@/components/cart/store";
import { Billing } from "./-billing";

export type ResponseCart = InferResponseType<typeof loggedInCartApi.index.$get>;

export const Route = createFileRoute("/(default)/cart/")({
  component: RouteComponent,
});

const deliveryInstructions = {
  name: "deliveryInstructions",
  label: "Delivery Instructions",
  description: "We will inform the delivery partner",
  icon: MessageSquareText,
  options: [
    {
      name: "leave-at-door",
      label: "Leave at door",
      icon: MapPin,
      description: "Leave the order at my doorstep",
    },
    {
      name: "ring-doorbell",
      label: "Ring doorbell",
      icon: Clock,
      description: "Please ring the doorbell upon arrival",
    },
    {
      name: "call-on-arrival",
      label: "Call on arrival",
      icon: Phone,
      description: "Call me when you arrive",
    },
    {
      name: "pet-at-home",
      label: "Pet is at home",
      icon: Dog,
      description: "Beware of pets at home",
    },
  ],
};

function RouteComponent() {
  return (
    <>
      <DashboardHeader title="Cart" />
      <CartMainContent />
    </>
  );
}

export const CartMainContent = () => {
  const { setCart, resetCart } = useCartStore();
  const { data, isLoading, isFetched } = useAPIQuery(
    loggedInCartApi.index,
    "$get",
    {}
  );

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  // Update cart when data changes

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isFetched && data) {
      // setCart(data);
      const cart: ProductInCart[] = [];
      for (const item of data.store) {
        for (const product of item.items) {
          cart.push({
            inventoryId: product.inventoryId as string,
            quantity: product.quantity as number,
          });
        }
      }
      setCart(cart);
    }
  }, [isFetched, data]);

  const queryClient = useQueryClient();

  const removeFromCart = useAPIMutation(
    loggedInCartApi[":shopHandle"],
    "$delete",
    {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: apiQueryOptions(loggedInCartApi.index, "$get", {}).queryKey,
        });
      },
    }
  );
  const { deliveryLocation } = useLocationStore();
  const [detailedAddressDrawerOpen, setDetailedAddressDrawerOpen] =
    useState(false);

  const [isRemovingFromCart, setIsRemovingFromCart] = useState(false);
  const [removingShopHandle, setRemovingShopHandle] = useState("");

  const handleRemoveFromCart = async (shopHandle: string) => {
    try {
      setIsRemovingFromCart(true);
      setRemovingShopHandle(shopHandle);
      await removeFromCart.mutateAsync({
        param: {
          shopHandle: shopHandle,
        },
      });
    } finally {
      setIsRemovingFromCart(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (data && data?.store?.length === 0) || !data ? (
        <EmptyPage icon={ShoppingBag} title="Your Cart is Empty" label=" " />
      ) : (
        <div>
          <div className="relative py-4">
            <div className="space-y-4">
              {data?.store.map((s) => (
                <Card key={s.storeHandle}>
                  {/* Store name header */}
                  <CardHeader className="flex items-center justify-between mb-2 border-b -mx-4 ">
                    <Link
                      className="flex items-center gap-2 px-4"
                      to="/$storeHandle"
                      params={{ storeHandle: s?.storeHandle as string }}
                    >
                      <Avatar className="rounded-md size-10">
                        <AvatarImage src={s.storeImage || ""} />
                        <AvatarFallback>
                          <Store />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-semibold">{s.storeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {s.items.length}{" "}
                          {s.items.length > 1 ? "items" : "item"}
                        </p>
                      </div>
                    </Link>
                    <p
                      className="text-muted-foreground underline decoration-dashed px-4 cursor-pointer"
                      style={{ textUnderlineOffset: "4px" }}
                      onClick={() =>
                        handleRemoveFromCart(s?.storeHandle as string)
                      }
                    >
                      {isRemovingFromCart &&
                      removingShopHandle === s?.storeHandle
                        ? "Removing..."
                        : "Remove"}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-8">
                    {s.items
                      .sort((a, b) =>
                        a.inStock === b.inStock ? 0 : a.inStock ? -1 : 1
                      )
                      .map((product, index, array) => {
                        const isFirstOutOfStock =
                          !product.inStock &&
                          (index === 0 || array[index - 1].inStock);

                        return (
                          <div
                            key={product.inventoryId}
                            className={`${isFirstOutOfStock ? "border-t pt-4" : ""} `}
                          >
                            {isFirstOutOfStock && (
                              <p className="pb-2 text-destructive font-medium text-base">
                                Out of stock
                              </p>
                            )}

                            <ProductComp
                              product={product}
                              inStock={product.inStock}
                              className={`${!product.inStock ? "opacity-50" : ""}`}
                            />
                          </div>
                        );
                      })}
                  </CardContent>
                </Card>
              ))}

              <Billing data={data} />

              <div className="mb-40">
                <DeliveryInstruction />
              </div>
            </div>

            {/* Bottom Checkout UI */}
            <div className="fixed bottom-0 left-0 lg:left-auto right-0 border-t w-full bg-card shadow-xl border-2 rounded-t-xl p-2 lg:w-[500px]">
              <div
                className="rounded-t-xl  cursor-pointer border-b border-dashed pb-2"
                onClick={() => setDetailedAddressDrawerOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="rounded-md">
                    <AvatarFallback>
                      <MapPinned className="size-6 fill-secondary/40" />
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        Delivering to {deliveryLocation?.tag}
                      </p>
                      <ChevronDown className="size-5" />
                    </div>
                    <p className="line-clamp-1 text-xs">
                      {[
                        deliveryLocation?.name,
                        deliveryLocation?.metadata?.building,
                        deliveryLocation?.line1,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* <PlaceOrder setOpen={setDetailedAddressDrawerOpen} data={data} /> */}
            </div>
          </div>
        </div>
      )}

      {detailedAddressDrawerOpen && (
        <DetailedAddress
          fullAddress={deliveryLocation}
          open={detailedAddressDrawerOpen}
          onOpenChange={setDetailedAddressDrawerOpen}
          label={"Edit"}
          isDeliveryAddress
        />
      )}
    </>
  );
};

export function ProductComp({
  product,
  inStock = true,
  className,
}: {
  product: ResponseCart["store"][number]["items"][number];
  inStock: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-start gap-2">
        <div className=" relative aspect-square size-12">
          <Link
            to="/$storeHandle/products/$productId"
            params={{
              storeHandle: product?.storeHandle ?? "",
              productId: product?.productId ?? "",
            }}
          >
            <img
              alt={""}
              src={product.thumbnail || "/assets/paper-bag-items.webp"}
              className={cn("w-full h-full object-cover rounded-md bg-accent")}
            />
          </Link>
        </div>

        <div>
          <p className="line-clamp-2  leading-4">{product.title}</p>
          <p className="text-muted-foreground text-xs">
            {product.quantity} x {product.unit}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {inStock && (
          <AddToCart
            product={{
              inventoryId: product.inventoryId as string,
              quantity: product.quantity as number,
            }}
            variant={"primary"}
            activeVariant="tertiary-active"
          />
        )}

        <div
          className={cn(inStock ? "flex items-center gap-2" : "flex flex-col")}
        >
          {product.maxPrice && product.maxPrice > (product.price ?? 0) && (
            <p className="line-through text-muted-foreground">
              {formatAmount(
                "inr",
                (product?.maxPrice ?? 0) * (product?.quantity ?? 0)
              )}
            </p>
          )}

          <p className="font-semibold">
            {formatAmount(
              "inr",
              (product.price ?? 0) * (product.quantity ?? 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function DeliveryInstruction() {
  const [drawerDialogOpen, setDrawerDialogOpen] = useState(false);
  const { instructions, setInstructions } = useCartStore();
  return (
    <div>
      <div className="rounded-xl bg-card divide-y divide-dashed">
        <div
          className="flex items-center justify-between p-4"
          onClick={() => {
            setDrawerDialogOpen(true);
          }}
        >
          <div className="flex items-center gap-2">
            <deliveryInstructions.icon className="size-6 stroke-2" />
            <div>
              <p className="font-medium">{deliveryInstructions.label}</p>
              <p className="text-muted-foreground text-xs">
                {instructions.deliveryInstruction ||
                  deliveryInstructions.description}
              </p>
            </div>
          </div>
          <ChevronRight className="size-5" />
        </div>
      </div>

      <DrawerDialogSwitcher
        open={drawerDialogOpen}
        onOpenChange={setDrawerDialogOpen}
      >
        <DrawerDialogHeader>
          <div className="flex items-center gap-4">
            <deliveryInstructions.icon className="size-8 stroke-2" />
            <div>
              <p className="font-medium">{deliveryInstructions.label}</p>
              <p className="text-muted-foreground text-xs">
                {deliveryInstructions.description}
              </p>
            </div>
          </div>
        </DrawerDialogHeader>
        <div className="space-y-2">
          {deliveryInstructions.options.map((option) => (
            <div
              key={option.name}
              className={cn(
                instructions.deliveryInstruction === option.label &&
                  "bg-primary/10 ring ring-primary",
                "flex items-center gap-4 p-4 border rounded-xl"
              )}
              onClick={() => {
                setInstructions({ deliveryInstruction: option.label });
              }}
            >
              <option.icon className="size-6 stroke-1.5" />
              <div>
                <p className="font-medium">{option.label}</p>
                <p className="text-muted-foreground text-xs">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DrawerDialogSwitcher>
    </div>
  );
}
