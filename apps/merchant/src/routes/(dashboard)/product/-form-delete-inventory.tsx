import { useInventoryInvalidate } from "@/routes/admin/product/-hook-invalidate";
import { useGlobalSessionStore } from "@/stores/global";
import { merchantInventoryApi, type merchantProductApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogClose,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Checkbox } from "@lipy/web-ui/components/ui/checkbox";
import { Label } from "@lipy/web-ui/components/ui/label";
import { useDebouncedCallback } from "@lipy/web-ui/hooks/use-debounced-callback";
import { cn } from "@lipy/web-ui/lib/utils";
import type { InferResponseType } from "hono/client";
import { type ReactNode, useState } from "react";

export default function FormDeleteInventory({
  children,
  inventory,
}: {
  inventory: InferResponseType<
    (typeof merchantProductApi.index)["$get"]
  >["items"][0]["variants"][0];
  children: ReactNode;
}) {
  const { promptOnDelete, update } = useGlobalSessionStore();
  const [open, setOpen] = useState(false);

  const { invalidate } = useInventoryInvalidate();

  const mutation = useAPIMutation(merchantInventoryApi.index, "$patch", {
    onMutate: () => {
      setOpen(false);
    },
    onError: () => {
      invalidate();
    },
    onSuccess: () => {
      invalidate();
    },
  });

  const handleDelete = useDebouncedCallback(async () => {
    await mutation.mutateAsync({
      json: {
        id: inventory.inventoryId!,
        active: inventory.active!,
        operation: "delete",
        sku: inventory.sku!,
        variantId: inventory.id!,
        price: inventory.storePrice!,
        stock: inventory.stock!,
      },
    });
  }, 100);

  if (promptOnDelete)
    return (
      <DrawerDialogSwitcher
        className=""
        open={open}
        onOpenChange={setOpen}
        trigger={
          <div
            className={cn(
              (mutation.isPending || mutation.isSuccess) &&
                "pointer-events-none opacity-50"
            )}
          >
            {children}
          </div>
        }
      >
        <DrawerDialogHeader>
          <DrawerDialogTitle>Delete Product</DrawerDialogTitle>
          <DrawerDialogDescription>
            Are you sure, you want to delete product from your store?
          </DrawerDialogDescription>
        </DrawerDialogHeader>
        <DrawerDialogFooter>
          <Label className="flex-1 justify-start">
            <Checkbox onCheckedChange={(v) => update({ promptOnDelete: !v })} />{" "}
            Don't ask again?
          </Label>
          <DrawerDialogClose />
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </DrawerDialogFooter>
      </DrawerDialogSwitcher>
    );
  return (
    <div
      onClick={handleDelete}
      className={cn(
        (mutation.isPending || mutation.isSuccess) &&
          "pointer-events-none opacity-50"
      )}
    >
      {children}
    </div>
  );
}
