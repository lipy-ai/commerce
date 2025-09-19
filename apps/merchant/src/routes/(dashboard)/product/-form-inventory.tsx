import { merchantInventoryApi, merchantProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
  apiQueryOptions,
  useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Switch } from "@lipy/web-ui/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import type React from "react";
import { useState } from "react";

type Response = InferResponseType<
  typeof merchantProductApi.index.$get
>["items"][0]["products"][0];
export function FormStockStatus({
  children,
  product,
}: {
  children: React.ReactNode;
  product: Response;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useAPIMutation(merchantInventoryApi.index, "$patch", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: apiQueryOptions(merchantProductApi.index, "$get").queryKey,
      });
    },
  });

  const handle = async (variant: NonNullable<Response["variants"]>[number]) => {
    await mutation.mutateAsync({
      json: {
        id: variant?.inventoryId as string,
        variantId: variant?.id as string,
        price: variant?.price || 0,
        inStock: !variant?.inStock,
        sku: undefined,
        active: true,
        operation: "update",
      },
    });
  };
  return (
    <DrawerDialogSwitcher open={open} onOpenChange={setOpen} trigger={children}>
      <DrawerDialogHeader className="-mx-4 border-b px-4">
        <DrawerDialogTitle>{product.title}</DrawerDialogTitle>
      </DrawerDialogHeader>

      <div className="divide-y divide-dashed">
        {product?.variants &&
          product?.variants.length > 0 &&
          product?.variants?.map((v) => (
            <div key={v.id} className="py-6 flex items-center justify-between">
              <div>
                <p className="font-medium">{v?.unit}</p>
                <p>{formatAmount("inr", v?.price || 0)}</p>
              </div>

              <Switch
                checked={v?.inStock || false}
                className="data-[state=checked]:bg-green-600 "
                onClick={() => handle(v)}
                disabled={mutation.isPending}
              />
            </div>
          ))}
      </div>
    </DrawerDialogSwitcher>
  );
}
