import { env } from "@envClient";
import { posOrderApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { scrollToElementHorizontal } from "@lipy/lib/utils/scroll";
import {
  apiQueryOptions,
  useAPIMutation,
  useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import { ORDER_STATUS } from "@lipy/server/db/schema";
import { OrderStatus } from "@lipy/web-ui/components/custom-ui/orderStatus";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
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
// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
// } from "@lipy/web-ui/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@lipy/web-ui/components/ui/hover-card";
import { Label } from "@lipy/web-ui/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@lipy/web-ui/components/ui/sheet";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import ZoomImg from "@lipy/web-ui/components/veiwers/zoomableImage";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@lipy/web-ui/components/ui/select";
// import { Separator } from "@lipy/web-ui/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import type { InferRequestType } from "hono";
import { produce } from "immer";
import {
  Ban,
  Box,
  Check,
  IndianRupee,
  Info,
  Mail,
  PackageCheck,
  Phone,
  PhoneCall,
  Truck,
  Undo,
  X,
} from "lucide-react";
import { Fragment, useEffect, useMemo } from "react";
import { OrderEdit } from "@/components/order.edit";
import OrderDeliverForm from "./-form.delivered";
import OrderRejectForm from "./-form.reject";
export const Route = createFileRoute("/pos/order/$id/")({
  component: RouteComponent,
});

type PatchTypes = InferRequestType<(typeof posOrderApi)[":id"]["$patch"]>;
// const baseStatus = [
//   "created",
//   "accepted",
//   "packed",
//   "out_for_delivery",
//   "delivered",
//   "completed",
// ] satisfies PatchTypes["json"]["status"][];

// const status = [
//   ...baseStatus,
//   "return_requested",
//   "refunded",
//   "replaced",
//   "canceled",
//   "awaiting_customer_confirmation",
// ] satisfies PatchTypes["json"]["status"][];

function RouteComponent() {
  const { id }: any = Route.useParams();
  const { isMobile } = useViewport();
  const queryClient = useQueryClient();
  const q = apiQueryOptions(posOrderApi[":id"], "$get", {
    param: { id },
  });

  const { data, isLoading } = useAPIQuery(posOrderApi[":id"], "$get", {
    param: { id },
  });

  const mutation = useAPIMutation(posOrderApi[":id"], "$patch", {
    onMutate: ({ json: { type, ...rest } }) => {
      queryClient.setQueryData(q.queryKey, (prev: typeof data) =>
        produce(prev, (draft) => {
          if (!draft) return;

          if (type === "update") {
            Object.assign(draft, rest);
            draft.status = "awaiting_customer_confirmation";
          }

          if (type === "delivered") {
            Object.assign(draft, rest);
            draft.status = "delivered";
          }

          if (type === "replaced") {
            draft.status = "replaced";
          }

          if (type === "refunded") {
            draft.status = "refunded";
          }

          if (type === "accept") {
            draft.status = "accepted";
          }

          if (type === "packed") {
            draft.status = "packed";
          }

          if (type === "out_for_delivery") {
            draft.status = "out_for_delivery";
          }

          if (type === "cancel") {
            draft.status = "canceled";
          }
        })
      );
    },
    onError() {
      // queryClient.invalidateQueries({ queryKey: q.queryKey });
    },
  });

  const handlePrint = () => {
    const printContents = document.getElementById("invoice-content")?.innerHTML;
    if (!printContents) return;

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handlePatch = async (json: PatchTypes["json"]) => {
    await mutation.mutateAsync({
      param: { id },
      json: json,
    });
  };

  useEffect(() => {
    data?.status && scrollToElementHorizontal(data.status);
  }, [data]);

  const hasStatus = (s: (typeof ORDER_STATUS)[number][]) =>
    data?.status && s.includes(data?.status);

  const statusIdx = ORDER_STATUS.indexOf(data?.status as any);
  const isCurrStatusAfterIdx = (s: (typeof ORDER_STATUS)[number]) => {
    if (statusIdx >= ORDER_STATUS.indexOf(s)) return true;
    return false;
  };

  const b1Status: (typeof ORDER_STATUS)[number][] = [
    "created",
    "canceled",
    "completed",
  ];
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const actions = useMemo(() => {
    const arr = [
      {
        name: "Accept Order",
        icon: Check,
        disabled: !hasStatus(["created"]),
        onClick: () => {
          handlePatch({ type: "accept" });
        },
      },
      {
        name: "Reject Order",
        icon: X,
        enableIfStatusAre: ["created"],
        disabled: !hasStatus(["created"]),
        dialog: OrderRejectForm,
        show: hasStatus(["created"]),
      },
      {
        name: "Order Packed",
        disabled: hasStatus([...b1Status]) || isCurrStatusAfterIdx("packed"),
        icon: Box,
        onClick: () => {
          handlePatch({ type: "packed" });
        },
      },
      {
        name: "Out for delivery",
        disabled:
          hasStatus([...b1Status]) || isCurrStatusAfterIdx("out_for_delivery"),
        icon: Truck,
        onClick: () => {
          handlePatch({ type: "out_for_delivery" });
        },
      },
      {
        name: "Order Delivered",
        disabled: hasStatus([...b1Status]) || isCurrStatusAfterIdx("delivered"),
        icon: PackageCheck,
        dialog: OrderDeliverForm,
      },
      {
        name: "Replace Items",
        disabled: hasStatus([...b1Status]),
        icon: Undo,
        onClick: () => {
          handlePatch({ type: "replaced" });
        },
      },
      {
        name: "Refund Money",
        disabled: hasStatus([...b1Status]),
        icon: IndianRupee,
        onClick: () => {
          handlePatch({ type: "refunded" });
        },
      },
      {
        name: "Cancel Order",
        disabled: hasStatus([...b1Status]),
        icon: Ban,
        show: !hasStatus(["created", "delivered"]),
        dialog: OrderRejectForm,
      },
    ];
    return arr;
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Skeleton className="flex-1 m-8" />
      ) : (
        <div className="flex flex-col">
          <DashboardHeader title={isMobile ? "Edit order" : `#${data?.id}`}>
            {isMobile && <OrderStatus status={data?.status ?? "created"} />}
          </DashboardHeader>

          {/* Hidden iframe for printing */}

          <div
            className="lg:grid lg:grid-cols-12 flex-1  print:p-0  lg:m-4 gap-x-8"
            id={"invoice-content"}
          >
            <div className=" col-span-12 flex flex-col lg:flex-row  p-4 lg:p-0 justify-between  space-y-4 w-full">
              <div>
                <h1 className="text-3xl font-semibold mb-2">Order ID: {id}</h1>
                <div className="flex items-center gap-4">
                  <p>
                    Order placed on{" "}
                    {format(new Date(data?.orderedAt as string), "PPp")}
                  </p>

                  <div className="hidden lg:block print:hidden">
                    <OrderStatus status={data?.status ?? "created"} />
                  </div>
                </div>
              </div>

              <div className=" flex gap-2 print:hidden">
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="flex-1 font-medium"
                  onClick={handlePrint}
                >
                  Invoice
                </Button>
                <div className="flex-1 flex flex-col shrink-0 flex-wrap md:flex-row gap-4 ">
                  <Sheet>
                    <SheetTrigger asChild>
                      {hasStatus(["created"]) && (
                        <Button
                          className="font-medium"
                          size={isMobile ? "sm" : "default"}
                        >
                          Modify order
                        </Button>
                      )}
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-[1200px] w-full">
                      {data && <OrderEdit data={data} />}
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
            <div className="col-span-8 print:shadow-none print:none space-y-4">
              <Card className="print:hidden">
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {actions?.map((a) => {
                      const delivered = a.name === "Order Delivered";
                      if (a.show === false) return;
                      const btn = (
                        <div
                          className={cn(
                            "flex gap-2 items-center border rounded bg-card p-4 cursor-pointer hover:bg-accent",
                            !delivered &&
                              a.disabled &&
                              "cursor-not-allowed bg-muted pointer-events-none",
                            delivered && "bg-muted"
                          )}
                          key={a.name}
                          onClick={() =>
                            !a.disabled && !delivered && a?.onClick?.()
                          }
                        >
                          <span
                            className={cn(
                              "p-1 bg-accent text-foreground rounded",
                              // a?.className,
                              a.disabled && "bg-primary text-primary-foreground"
                            )}
                          >
                            <a.icon className="size-5" />
                          </span>
                          <Label className="capitalize">
                            {a.name.replaceAll("_", " ")}
                          </Label>
                        </div>
                      );
                      return (
                        <Fragment key={a.name}>
                          {a.dialog ? (
                            <a.dialog onSubmit={handlePatch} data={data}>
                              {btn}
                            </a.dialog>
                          ) : (
                            btn
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {data?.customerInstructions?.attachments &&
                data.customerInstructions.attachments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Instructions</CardTitle>
                    </CardHeader>

                    <CardContent className="flex gap-3">
                      {data?.customerInstructions?.attachments?.map((a, i) => (
                        <ZoomImg src={a} key={i} />
                      ))}
                    </CardContent>
                  </Card>
                )}

              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-dashed">
                  {data?.items?.map((m, i) => (
                    <div
                      key={i}
                      className="flex gap-2 items-starts py-4 first:pt-0"
                    >
                      <img
                        src={
                          m.thumbnail ||
                          "https://api.dicebear.com/9.x/glass/svg"
                        }
                        alt={m.title}
                        className="size-12 border border-border/40 object-contain rounded bg-card print:hidden"
                      />
                      <div className="flex-1">
                        <h2 className="max-w-11/12 line-clamp-2">{m.title}</h2>
                        <p className="text-muted-foreground">{m.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatAmount("inr", m.price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty {m.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <p>Item Total ({data?.items?.length} Items)</p>
                    <p className="font-medium">
                      {formatAmount("inr", Number(data?.itemTotalAmount))}
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
                            Number(data?.totalDiscountAmount)
                          )}
                        </p>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 my-2 py-2  text-muted-foreground">
                      {data?.discounts && data?.discounts?.length > 0
                        ? data?.discounts?.map((t, i) => (
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
                          {formatAmount("inr", Number(data?.totalTaxAmount))}
                        </p>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 my-2 py-2  text-muted-foreground">
                      {data?.taxes && data?.taxes?.length > 0
                        ? data?.taxes?.map((t, i) => (
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
                    {formatAmount("inr", Number(data?.totalAmount))}
                  </p>
                </CardFooter>
              </Card>
            </div>

            <div className="col-span-4 space-y-4 pt-4 md:pt-0">
              <Card className="print:hidden">
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base">Store Instruction</Label>
                    <p className="text-muted-foreground">
                      {data?.customerInstructions?.store ||
                        "No instruction from customer"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Delivery Instruction</Label>
                    <p className="text-muted-foreground">
                      {data?.customerInstructions?.delivery ||
                        "No instruction from customer"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="print:shadow-none print:border-t">
                <CardContent className="space-y-4 print:border-0">
                  <Label className="text-base">Customer</Label>
                  <div className="border-b pb-4  flex items-start justify-between gap-6">
                    <div className="space-y-2">
                      <h1 className="font-medium text-base">
                        {data?.customerDetails?.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Phone className="size-4" />
                        <p>{data?.customerDetails?.phone || " - "}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="size-4" />
                        <p>{data?.customerDetails?.email || " - "}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 print:hidden">
                      {data?.customerDetails?.phone && (
                        <a
                          href={`tel:${data?.customerDetails?.phone}`}
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "icon",
                            }),
                            "rounded-full"
                          )}
                        >
                          <PhoneCall />
                        </a>
                      )}
                      {data?.customerDetails?.email && (
                        <a
                          href={`mailto:${data?.customerDetails?.email}`}
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "icon",
                            }),
                            "rounded-full"
                          )}
                        >
                          <Mail />
                        </a>
                      )}
                    </div>
                  </div>

                  <Label className="text-base">Shipping Address</Label>
                  {data?.customerDetails?.address?.lat &&
                    data?.customerDetails?.address?.lng && (
                      <div className="space-y-4   border-b pb-4">
                        <div className="print:hidden">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${data.customerDetails?.address.lat},${data.customerDetails?.address.lng}`}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="space-y-2"
                          >
                            <img
                              src={
                                data?.customerDetails?.address?.lat &&
                                data?.customerDetails?.address?.lng
                                  ? `https://maps.googleapis.com/maps/api/staticmap?key=${env.GOOGLE_MAP_API_KEY}&zoom=15&size=500x200&scale=2&markers=size:mid%7Ccolor:red%7C${data?.customerDetails?.address?.lat},${data?.customerDetails?.address?.lng}`
                                  : undefined
                              }
                              alt="Delivery Address Map"
                              className="border rounded w-full bg-card"
                            />
                            <p className="text-end underline">View on Map</p>
                          </a>
                        </div>

                        {data.customerDetails?.address && (
                          <div>
                            <div className="whitespace-pre-line">
                              {[
                                data?.customerDetails?.address.name,
                                data?.customerDetails?.address?.metadata
                                  ?.building,
                                data?.customerDetails?.address.line1,
                              ]
                                .filter(Boolean)
                                .join("\n")}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  <div className="space-y-4 py-4 print:hidden">
                    <Label>Delivery Partner</Label>

                    <div className="space-y-4">
                      {data?.delivery?.agentId && (
                        <div className="flex gap-2">
                          <Avatar className="size-12">
                            <AvatarImage
                              src={data.delivery.image}
                              alt={data.delivery.name}
                            />
                            <AvatarFallback>
                              {data.delivery.name?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{data?.delivery.name}</p>
                            <p className="text-sm">{data?.delivery.phone}</p>
                          </div>
                        </div>
                      )}
                      <p className="font-light text-sm">
                        {data?.deliveryAgentAssignedAt
                          ? `Delivery partner was assigned on ${format(data.deliveryAgentAssignedAt, "PPpp")}`
                          : "Delivery partner hasn't been assigned yet."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
