import { OrderEdit } from "@/components/order.edit";
import { env } from "@envClient";
import { posOrderApi } from "@lipy/lib/api";
import { formatAddress } from "@lipy/lib/utils/address";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
  apiQueryOptions,
  useAPIMutation,
  useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import { GoogleMapsIcon } from "@lipy/web-ui/components/icons";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";

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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@lipy/web-ui/components/ui/select";
// import { Separator } from "@lipy/web-ui/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";

import { scrollToElementHorizontal } from "@lipy/lib/utils/scroll";
import { ORDER_STATUS } from "@lipy/server/db/schema";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@lipy/web-ui/components/ui/sheet";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import ZoomImg from "@lipy/web-ui/components/veiwers/zoomableImage";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
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
  Truck,
  Undo,
  X,
} from "lucide-react";
import { Fragment, useEffect, useMemo } from "react";
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

  // const handlePrint = () => {
  //   const printContents = document.getElementById("invoice-content")?.innerHTML;
  //   if (!printContents) return;

  //   const originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  //   window.location.reload();
  // };

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
    console.log(
      statusIdx,
      ORDER_STATUS.indexOf(s),
      s,
      statusIdx >= ORDER_STATUS.indexOf(s)
    );
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
    console.log(arr);
    return arr;
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Skeleton className="flex-1 m-8" />
      ) : (
        <>
          <div className="min-h-screen flex flex-col">
            <DashboardHeader title={(!isMobile && `#${data?.id}`) || ""} />
            {/* Hidden iframe for printing */}

            <div
              className="lg:grid lg:grid-cols-12 flex-1 gap-8 print:p-0"
              id={"invoice-content"}
            >
              <div className="col-span-8 print:shadow-none">
                <div className="print:border-none">
                  <div className="flex gap-8 lg:gap-4 px-4 pt-4 justify-between">
                    <h1 className="text-2xl font-semibold items-center">
                      # {id}
                    </h1>

                    <div className="flex flex-col flex-wrap md:flex-row gap-4 print:hidden">
                      {/* <Button variant={"outline"} onClick={() => handlePrint()}>
                        Invoice
                      </Button> */}

                      <Sheet>
                        <SheetTrigger asChild>
                          {hasStatus(["created"]) && (
                            <Button variant={"outline"}>Modify Order</Button>
                          )}
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-[1200px] w-full">
                          {data && <OrderEdit data={data} />}
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2 p-4">
                    {/* <Badge variant={"accent"} className="capitalize w-fit">
                      {data?.status?.replaceAll("_", " ")}
                    </Badge>
                    <Badge variant={"accent"} className="capitalize w-fit">
                      Payable Amount{" "}
                      {formatAmount("inr", data?.totalAmount || 0)}
                    </Badge>
                    <Badge variant={"accent"} className="capitalize w-fit">
                      Order On{" "}
                      {data?.orderedAt && format(data?.orderedAt, "PPpp")}
                    </Badge> */}
                  </div>
                  <Separator />
                  <div className="p-4 space-y-4">
                    <Label>Order Actions</Label>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {actions?.map((a) => {
                        if (a.show === false) return;
                        const btn = (
                          <div
                            className={cn(
                              "flex gap-2 items-center border rounded bg-card p-4 cursor-pointer hover:bg-accent",
                              a.disabled &&
                                "cursor-not-allowed bg-muted pointer-events-none"
                            )}
                            key={a.name}
                            onClick={() => !a.disabled && a?.onClick?.()}
                          >
                            <span
                              className={cn(
                                "p-1 bg-accent text-foreground rounded",
                                // a?.className,
                                a.disabled &&
                                  "bg-primary text-primary-foreground"
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
                              <a.dialog onSubmit={handlePatch}>{btn}</a.dialog>
                            ) : (
                              btn
                            )}
                          </Fragment>
                        );
                      })}
                    </div>
                  </div>
                  <Separator />

                  {data?.customerInstructions?.store && (
                    <div className="p-4 space-y-4">
                      <Label>Store Instruction</Label>{" "}
                      <p>{data?.customerInstructions?.store || "-"}</p>
                    </div>
                  )}

                  {data?.customerInstructions?.attachments &&
                    data.customerInstructions.attachments.length > 0 && (
                      <>
                        {" "}
                        <div className="p-4 space-y-4">
                          <Label>Customer Attachments</Label>
                          {data?.customerInstructions?.attachments?.map(
                            (a, i) => (
                              <ZoomImg src={a} key={i} />
                            )
                          )}
                        </div>
                      </>
                    )}
                  {data?.customerInstructions?.store && (
                    <>
                      {" "}
                      <div className="p-4 space-y-4">
                        <Label>Delivery Instruction</Label>
                        <p>{data?.customerInstructions?.delivery || "-"}</p>
                      </div>
                    </>
                  )}

                  <div className="">
                    <div>
                      {data?.items?.map((m, i) => (
                        <div
                          key={i}
                          className="flex gap-2 items-center print:py-2 p-4"
                        >
                          <img
                            src={
                              m.thumbnail ||
                              "https://api.dicebear.com/9.x/glass/svg"
                            }
                            alt={m.title}
                            className="size-12 border rounded bg-accent print:hidden"
                          />
                          <div className="flex-1">
                            <h2 className="max-w-11/12 line-clamp-2">
                              {m.title}
                            </h2>
                            <Badge
                              variant={"info"}
                              size={"small"}
                              appearance="outline"
                            >
                              {" "}
                              {m.unit}
                            </Badge>
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
                    </div>
                  </div>
                  <Separator />

                  <div className="space-y-4 p-4">
                    <Label>Payment Summary</Label>
                    <div className="space-y-4">
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
                              {formatAmount(
                                "inr",
                                Number(data?.totalDiscountAmount)
                              )}
                            </p>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 my-2 py-2  text-muted-foreground">
                          {data?.taxes && data?.taxes?.length > 0
                            ? data?.discounts?.map((t, i) => (
                                <div
                                  key={i}
                                  className="flex w-full justify-between"
                                >
                                  <p className="capitalize">{t.name}</p>
                                  <p className="">
                                    {formatAmount("inr", Number(t?.amount))}
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
                            <p className="font-medium">
                              {formatAmount(
                                "inr",
                                Number(data?.totalDiscountAmount)
                              )}
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
                                  <p className="font-medium">
                                    {formatAmount("inr", Number(t?.amount))}
                                  </p>
                                </div>
                              ))
                            : "No Tax Applied"}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center p-4">
                    <p className="font-semibold text-xl">Total Payable</p>
                    <p className="font-semibold text-3xl mb-2">
                      {formatAmount("inr", Number(data?.itemTotalAmount))}
                    </p>
                  </div>
                </div>
              </div>
              <Card className="col-span-4 print:shadow-none print:border-t">
                <CardContent className="space-y-4 print:border-0">
                  {data?.customerDetails?.address?.lat &&
                    data?.customerDetails?.address?.lng && (
                      <div className="space-y-4 p-4 print:hidden">
                        {/* <iframe
                          width="100%"
                          height="250"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Delivery Address Map"
                          loading="lazy"
                          src={
                            data?.customerDetails?.address?.lat &&
                            data?.customerDetails?.address?.lng
                              ? `https://www.google.com/maps/embed/v1/place?key=${env.GOOGLE_MAP_API_KEY}&q=${data.customerDetails.address.lat},${data.customerDetails.address.lng}&zoom=15&maptype=roadmap`
                              : undefined
                          }
                          allowFullScreen
                          className="border rounded"
                        /> */}
                        <div>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${data.customerDetails?.address.lat},${data.customerDetails?.address.lng}`}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="space-y-4"
                          >
                            <img
                              src={
                                data?.customerDetails?.address?.lat &&
                                data?.customerDetails?.address?.lng
                                  ? `https://maps.googleapis.com/maps/api/staticmap?key=${env.GOOGLE_MAP_API_KEY}&zoom=15&size=400x200&scale=2&markers=size:mid%7Ccolor:red%7C${data?.customerDetails?.address?.lat},${data?.customerDetails?.address?.lng}`
                                  : undefined
                              }
                              alt="Delivery Address Map"
                              className="border rounded w-full bg-card"
                            />
                            <div className="flex justify-between items-center gap-4">
                              {" "}
                              <Label>View Directions</Label>{" "}
                              <Button
                                size={"icon"}
                                className="rounded"
                                variant={"outline"}
                              >
                                <GoogleMapsIcon />
                              </Button>
                            </div>
                          </a>
                        </div>

                        <div className="flex justify-between gap-4 flex-wrap items-center">
                          <div>
                            <Label className="">
                              {data?.customerDetails?.name}
                            </Label>
                            <p className="text-muted-foreground">
                              {data?.customerDetails?.phone}
                            </p>
                            <p className="text-muted-foreground">
                              {data?.customerDetails?.email}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {data?.customerDetails?.phone && (
                              <a
                                href={`tel:${data?.customerDetails?.phone}`}
                                className={cn(
                                  buttonVariants({
                                    variant: "outline",
                                    size: "icon",
                                  }),
                                  "rounded"
                                )}
                              >
                                <Phone />
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
                                  "rounded"
                                )}
                              >
                                <Mail />
                              </a>
                            )}
                          </div>
                        </div>
                        {data.customerDetails?.address && (
                          <div className="space-y-1">
                            <p>
                              {formatAddress(
                                data.customerDetails.address as any
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  <div className="space-y-4 p-4 print:hidden">
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
        </>
      )}
    </>
  );
}
