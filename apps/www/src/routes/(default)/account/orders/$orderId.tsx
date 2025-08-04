import { loggedIOrderApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
  apiQueryOptions,
  useAPIMutation,
  useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import { OrderStatus } from "@lipy/web-ui/components/custom-ui/orderStatus";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@lipy/web-ui/components/ui/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@lipy/web-ui/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@lipy/web-ui/components/ui/hover-card";
import Loading from "@lipy/web-ui/components/ui/loading";
import ZoomImg from "@lipy/web-ui/components/veiwers/zoomableImage";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  BanknoteArrowUp,
  CircleUser,
  Info,
  MapPin,
  MessageSquareText,
  PhoneCall,
  Store,
} from "lucide-react";
import { useState } from "react";
import { AccountNav } from "../-nav";

export const Route = createFileRoute("/(default)/account/orders/$orderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderId } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useAPIQuery(
    loggedIOrderApi[":id"],
    "$get",
    {
      param: {
        id: orderId,
      },
    },
    {
      placeholderData: (p) => p,
    }
  );

  const statusUpdateMutation = useAPIMutation(
    loggedIOrderApi[":id"],
    "$patch",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: apiQueryOptions(loggedIOrderApi[":id"], "$get", {
            param: { id: orderId },
          }).queryKey,
        });
      },
    }
  );

  const [disabled, setDisabled] = useState(false);

  const infos = [
    {
      title: "Receiver's Info",
      icon: CircleUser,
      value: (
        <div>
          <p>{order?.customerDetails?.address?.name}</p>
          <p>{order?.customerDetails?.address?.phone}</p>
        </div>
      ),
    },
    {
      title: "Delivery Address",
      icon: MapPin,
      value: [
        order?.customerDetails?.address?.metadata?.building,
        order?.customerDetails?.address?.line1,
      ]
        .filter(Boolean)
        .join(", "),
    },
    {
      title: "Payment Method",
      icon: BanknoteArrowUp,
      value:
        order?.paymentMethod === "cod" ? "Cash on Delivery" : "Unspecified",
    },
    {
      title: "Delivery Instruction",
      icon: MessageSquareText,
      value: order?.customerInstructions?.delivery,
    },
  ];

  const handleUpdateStatus = async (status: "canceled" | "accepted") => {
    setDisabled(true);
    await statusUpdateMutation.mutateAsync({
      param: { id: orderId },
      json: {
        status,
      },
    });
    setDisabled(false);
  };

  return (
    <AccountNav>
      {isLoading ? (
        <Loading />
      ) : !order ? (
        <EmptyPage
          title={"Order not found"}
          label="The order you are looking for does not exist or has been deleted."
        />
      ) : (
        <div className="w-full">
          <DashboardHeader
            titleChildren={
              <div>
                <p className="font-semibold text-xs">#{order?.id}</p>
                {order.items && order.items.length > 0 && (
                  <p className="text-muted-foreground text-xs">
                    {order?.items?.length || 0} item(s) |{" "}
                    {formatAmount(order.currency, order?.totalAmount || 0)}{" "}
                  </p>
                )}
              </div>
            }
          >
            <OrderStatus status={order.status ?? "created"} />
          </DashboardHeader>

          {order?.status === "awaiting_customer_confirmation" && (
            <div className="sticky top-12  bg-card py-4 md:px-6 z-5">
              <Alert variant={"info"}>
                <AlertTitle>Order updated</AlertTitle>
                <AlertDescription>
                  The shopkeeper has updated your order and is currently /
                  awaiting your confirmation. Please review your updated order.
                </AlertDescription>

                <div className="flex gap-4 py-2 ">
                  <Button
                    variant={"outline"}
                    size="sm"
                    onClick={() => handleUpdateStatus("canceled")}
                    disabled={disabled}
                  >
                    Cancel order
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus("accepted")}
                    disabled={disabled}
                  >
                    Accept updates
                  </Button>
                </div>
              </Alert>
            </div>
          )}
          <div className="md:grid md:grid-cols-12 gap-4 flex-1  md:px-6 md:pb-3">
            <div className="col-span-7  space-y-3">
              <Card>
                <CardHeader className="flex items-center justify-between gap-4 border-b -mx-4 px-4">
                  <Link
                    className="flex items-center gap-2"
                    to="/$storeHandle"
                    params={{
                      storeHandle: order.storeHandle ?? "",
                    }}
                  >
                    <Avatar className="rounded-md size-8">
                      <AvatarImage src={order.storeLogo || ""} />
                      <AvatarFallback>
                        <Store />
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-4">
                      <p className="font-medium text-base">{order.storeName}</p>
                      <p className="text-muted-foreground line-clamp-1">
                        {[order.storeAddress?.line2, order.storeAddress?.city]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </Link>

                  <a
                    href={`tel:${order?.storePhone}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "icon" }),
                      "rounded-full p-0.5"
                    )}
                  >
                    <PhoneCall className="text-ring size-5" />
                  </a>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium text-base pb-2">Order Details</p>
                  <div className="flex items-center justify-between">
                    <p className="">Order Id</p>
                    <p className="text-muted-foreground">{order?.id}</p>
                  </div>{" "}
                  <div className="flex items-center justify-between">
                    <p className="">
                      {order?.deliveredAt
                        ? "Delivered At"
                        : order?.canceledAt
                          ? "Canceled At"
                          : order?.refundedAt
                            ? "Refunded At"
                            : "Ordered At"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {order?.deliveredAt
                        ? format(new Date(order?.deliveredAt), "PPp")
                        : order?.canceledAt
                          ? format(new Date(order?.canceledAt), "PPp")
                          : order?.refundedAt
                            ? format(new Date(order?.refundedAt), "PPp")
                            : format(
                                new Date(order?.orderedAt as string),
                                "PPp"
                              )}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {order?.status !== "delivered" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your delivery OTP</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center tracking-[0.6em] text-2xl font-semibold text-spa">
                    <p>{order?.confirmationOtp}</p>
                  </CardContent>
                  <CardFooter className="text-muted-foreground text-xs">
                    * Share this OTP with delivery partner while receiving your
                    order
                  </CardFooter>
                </Card>
              )}

              {order?.items && order?.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Item(s) ordered</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {order?.items?.map((product, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Link
                          to="/$storeHandle/products/$productId"
                          params={{
                            storeHandle: order?.storeHandle ?? "",
                            productId: product.productId || "",
                          }}
                        >
                          <img
                            src={
                              product.thumbnail || "https://picsum.photos/200"
                            }
                            alt=""
                            className="size-12 border rounded border-border/40 object-contain bg-card"
                          />
                        </Link>

                        <div className="flex-1">
                          <h2 className="leading-4 line-clamp-2">
                            {product.title}
                          </h2>
                          <p className="text-muted-foreground text-xs">
                            {product.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatAmount(order.currency, product.price || 0)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty {product.qty || 0}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {order?.customerInstructions?.attachments &&
                order?.customerInstructions?.attachments?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your attachments</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div
                        className=" flex gap-4 overflow-x-auto scrollbar-hide -mx-4 p-4"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {order?.customerInstructions?.attachments?.map(
                          (file, index) => {
                            return (
                              <div
                                key={index}
                                className="relative flex-shrink-0"
                              >
                                <ZoomImg src={file} />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>

            <div className="col-span-5 space-y-3 mt-3 lg:mt-0">
              {order?.items && order?.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <p>Item Total ({order?.items?.length} Items)</p>
                      <p className="font-medium">
                        {formatAmount("inr", Number(order?.itemTotalAmount))}
                      </p>
                    </div>

                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <div className="flex w-full justify-between">
                          <p className="flex gap-1 items-center">
                            Total Discount
                            <HoverCard>
                              <HoverCardTrigger>
                                <Info className="size-4" />
                              </HoverCardTrigger>
                              <HoverCardContent>
                                Total discount applied on this order
                              </HoverCardContent>
                            </HoverCard>
                          </p>
                          <p className="">
                            -{" "}
                            {formatAmount(
                              "inr",
                              Number(order?.totalDiscountAmount)
                            )}
                          </p>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 my-2 py-2  text-muted-foreground">
                        {order?.discounts && order?.discounts?.length > 0
                          ? order?.discounts?.map((t, i) => (
                              <div
                                key={i}
                                className="flex w-full justify-between"
                              >
                                <p className="capitalize">{t.name}</p>
                                <p className="">
                                  {t.sum === "flat"
                                    ? formatAmount("inr", Number(t?.amount))
                                    : `${t?.amount} %`}
                                </p>
                              </div>
                            ))
                          : "No Discount Applied"}
                      </CollapsibleContent>
                    </Collapsible>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <div className="flex w-full justify-between">
                          <p className="flex gap-1 items-center">
                            Total Taxes
                            <HoverCard>
                              <HoverCardTrigger>
                                <Info className="size-4" />
                              </HoverCardTrigger>
                              <HoverCardContent>
                                Total taxes applied on this order
                              </HoverCardContent>
                            </HoverCard>
                          </p>
                          <p className="">
                            {formatAmount("inr", Number(order?.totalTaxAmount))}
                          </p>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 my-2 py-2  text-muted-foreground">
                        {order?.taxes && order?.taxes?.length > 0
                          ? order?.taxes?.map((t, i) => (
                              <div
                                key={i}
                                className="flex w-full justify-between"
                              >
                                <p className="capitalize">{t.name}</p>
                                <p className="">
                                  {t.sum === "flat"
                                    ? formatAmount("inr", Number(t?.amount))
                                    : `${t?.amount} %`}
                                </p>
                              </div>
                            ))
                          : "No Tax Applied"}
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                  <CardFooter className="w-full flex items-center justify-between border-t">
                    <p className="font-semibold text-xl">Total Payable</p>
                    <p className="font-semibold text-3xl">
                      {formatAmount("inr", Number(order?.totalAmount))}
                    </p>
                  </CardFooter>
                </Card>
              )}

              <Card className=" mb-20">
                <CardContent className="divide-y divide-dashed ">
                  {infos.map((info) => {
                    if (!info.value) return;
                    return (
                      <div
                        key={info?.title}
                        className="flex items-start gap-2 py-4 first:pt-0 last:pb-0"
                      >
                        <info.icon className="text-muted-foreground flex-shrink-0 size-6" />
                        <div>
                          <p className="font-medium ">{info.title}</p>
                          <p className="text-muted-foreground">{info.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </AccountNav>
  );
}
