import { adminProductApi } from "@lipy/lib/api";
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

import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useDebouncedCallback } from "@lipy/web-ui/hooks/use-debounced-callback";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProductInvalidate } from "./-hook-invalidate";

export default function FormDelete() {
  // const { promptOnDelete, update } = useGlobalSessionStore();
  const [open, setOpen] = useState(false);
  const { view, product } = useSearch({ from: "/admin/product/" });
  const navigate = useNavigate({ from: "/admin/product" });
  const { invalidate } = useProductInvalidate();

  const mutation = useAPIMutation(adminProductApi.index, "$delete", {
    onMutate: () => {
      setOpen(false);
    },
    onError: () => {
      invalidate();
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (view === "delete") {
      setOpen(true);
    }
  }, [view]);

  const handleDelete = useDebouncedCallback(async () => {
    if (!product) {
      return toast.error("No product mentioned!");
    }
    await mutation.mutateAsync({ json: { ids: [product] } });
  }, 100);

  return (
    <DrawerDialogSwitcher
      className=""
      open={open}
      onOpenChange={(v) => {
        setOpen(v);

        if (!v) {
          navigate({
            search: (s) => ({ ...s, view: undefined, product: undefined }),
          });
        }
      }}
    >
      <DrawerDialogHeader>
        <DrawerDialogTitle>Delete Product</DrawerDialogTitle>
        <DrawerDialogDescription>
          Are you sure, you want to delete product?
        </DrawerDialogDescription>
      </DrawerDialogHeader>
      <DrawerDialogFooter>
        <DrawerDialogClose />
        <Button onClick={handleDelete} variant="destructive">
          Delete Permanently
        </Button>
      </DrawerDialogFooter>
    </DrawerDialogSwitcher>
  );
}
