import type { loggedInCartApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
  DrawerDialogFooter,
  DrawerDialogSwitcher,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import type { InferResponseType } from "hono/client";
import { Bike, PercentCircle, ReceiptText } from "lucide-react";
import { useState } from "react";

type Response = InferResponseType<typeof loggedInCartApi.index.$get>;
export function Billing({ data }: { data: Response }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {data.store.map((s) => (
          <div
            key={s.storeId}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2">
              <ReceiptText className="size-4 flex-shrink-0" />
              <p>Item total ({s.storeName})</p>
            </div>
            <p>
              <span className="text-muted-foreground line-through pr-2">
                {formatAmount("inr", s?.storeMaxItemsTotal)}
              </span>
              <span className="font-medium">
                {formatAmount("inr", s?.storeItemsTotal)}
              </span>
            </p>
          </div>
        ))}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Bike className="size-4 mt-1 flex-shrink-0" />
            <BillingDetails data={data} type="delivery">
              <p
                className="underline decoration-dashed  cursor-pointer decoration-muted-foreground"
                style={{ textUnderlineOffset: "4px" }}
              >
                Delivery Charge
              </p>
            </BillingDetails>
          </div>

          <span className="font-medium">
            {formatAmount("inr", data?.totalDeliveryCharge)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <PercentCircle className="size-4 mt-1 flex-shrink-0" />
            <BillingDetails data={data} type="tax">
              <p
                className="underline decoration-dashed  cursor-pointer decoration-muted-foreground"
                style={{ textUnderlineOffset: "4px" }}
              >
                Taxes
              </p>
            </BillingDetails>
          </div>

          <span className="font-medium">
            {formatAmount("inr", data?.taxTotal)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t flex flex-col gap-2">
        <div className=" flex items-center justify-between w-full text-base font-semibold">
          <p>Total Payable</p>
          <p>{formatAmount("inr", data.totalAmount)}</p>
        </div>
        {data?.totalSaved > 0 && (
          <Badge
            className="ml-auto"
            variant="success"
            size="default"
            appearance="solid"
          >
            You saved {formatAmount("inr", data.totalSaved)}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}

function BillingDetails({
  children,
  data,
  type,
}: {
  children: React.ReactNode;
  data: Response;
  type: "tax" | "delivery";
}) {
  const [open, setOpen] = useState(false);
  return (
    <DrawerDialogSwitcher
      open={open}
      onOpenChange={setOpen}
      trigger={<div>{children}</div>}
      className="p-4 "
    >
      <div className="py-4 space-y-2">
        {data?.store.map((s) => (
          <div key={s.storeId} className="space-y-2">
            <div className="flex items-center justify-between gap-6 font-medium text-base">
              <p>{s.storeName}</p>
              <p>
                {formatAmount(
                  "inr",
                  type === "tax"
                    ? s.storeTax
                    : type === "delivery"
                      ? s.storDeliveryCharge
                      : 0
                )}
              </p>
            </div>
            <div className="flex items-center justify-between gap-6 ">
              <p>
                {type === "tax"
                  ? "GST on item total"
                  : type === "delivery"
                    ? "Delivery Charge"
                    : ""}
              </p>
              <p>
                {formatAmount(
                  "inr",
                  type === "tax"
                    ? s.storeTax
                    : type === "delivery"
                      ? s.storDeliveryCharge
                      : 0
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <DrawerDialogFooter className="border-t py-4">
        <div className="flex items-center justify-between gap-6 font-medium text-base">
          <p>Total</p>
          <p>
            {formatAmount(
              "inr",
              type === "tax"
                ? data?.taxTotal
                : type === "delivery"
                  ? data?.totalDeliveryCharge
                  : 0
            )}
          </p>
        </div>
      </DrawerDialogFooter>
    </DrawerDialogSwitcher>
  );
}
