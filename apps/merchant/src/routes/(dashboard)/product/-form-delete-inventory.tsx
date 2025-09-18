import { merchantInventoryApi } from "@lipy/lib/api";
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
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useDebouncedCallback } from "@lipy/web-ui/hooks/use-debounced-callback";
import { cn } from "@lipy/web-ui/lib/utils";
import { type ReactNode, useState } from "react";
import { useInventoryInvalidate } from "@/routes/admin/product/-hook-invalidate";
import { useGlobalSessionStore } from "@/stores/global";

export default function FormDeleteInventory({
  children,
  inventory,
}: {
  inventory: any;
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
      toast.success("Item deleted from inventory");
      invalidate();
    },
  });

  const handleDelete = useDebouncedCallback(async () => {
    await mutation.mutateAsync({
      json: {
        id: inventory.inventoryId!,
        operation: "delete",
        variantId: inventory.id!,
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
