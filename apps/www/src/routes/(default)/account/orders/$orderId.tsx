import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import type { ORDER_STATUS } from "@lipy/server/db/schema";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Badge } from "@lipy/web-ui/components/ui/badge";

import { loggedIOrderApi } from "@lipy/lib/api";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import Loading from "@lipy/web-ui/components/ui/loading";
import ZoomImg from "@lipy/web-ui/components/veiwers/zoomableImage";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  BanknoteArrowUp,
  CircleUser,
  MapPin,
  MessageSquareText,
  PhoneCall,
  Store,
} from "lucide-react";
import { ORDER_STATUS_BADGE_VARIANT } from ".";

export const Route = createFileRoute("/(default)/account/orders/$orderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderId } = Route.useParams();

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

  const billingInfo = [
    {
      title: `Item Total (${order?.items?.length ?? 0})`,
      value: formatAmount("inr", order?.itemTotalAmount ?? 0),
    },
    {
      title: "Delivery Charges",
      value: formatAmount("inr", 0),
    },
    {
      title: "Tax",
      value: formatAmount("inr", order?.totalTaxAmount ?? 0),
    },
  ];

  return (
    <>
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
            <Badge
              variant={
                ORDER_STATUS_BADGE_VARIANT[
                  order.status as (typeof ORDER_STATUS)[number]
                ] || "neutral"
              }
              className="capitalize line-clamp-1 max-w-44 break-words"
            >
              {order.status || "Unknown"}
            </Badge>
          </DashboardHeader>

          <div className="lg:grid lg:grid-cols-12 divide-x flex-1 mt-3">
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
                            className="size-12 border rounded bg-accent"
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

            <div className="col-span-5 space-y-3 mt-3">
              {order?.items && order?.items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bill Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {billingInfo.map((item, index) => (
                      <div className="flex justify-between text-sm" key={index}>
                        <p>{item.title}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t border-dashed">
                    <p className="font-semibold text-base">Total Payable</p>
                    <p className="font-semibold text-xl">
                      {formatAmount(order?.currency, order?.totalAmount || 0)}
                    </p>
                  </CardFooter>
                </Card>
              )}

              <div className="divide-y divide-dashed bg-card rounded-xl mb-20">
                {infos.map((info) => {
                  if (!info.value) return;
                  return (
                    <div
                      key={info?.title}
                      className="flex items-start gap-2 p-4"
                    >
                      <info.icon className="text-muted-foreground flex-shrink-0 size-6" />
                      <div>
                        <p className="font-medium ">{info.title}</p>
                        <p className="text-muted-foreground">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
