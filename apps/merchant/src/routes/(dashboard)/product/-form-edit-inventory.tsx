import { merchantInventoryApi, type merchantProductApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import {
  FormButton,
  FormInput,
  FormSwitch,
} from "@lipy/web-ui/components/forms/elements";
import {
  Form,
  FormDescription,
  FormLabel,
} from "@lipy/web-ui/components/ui/form";
import type { InferResponseType } from "hono/client";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { useInventoryInvalidate } from "@/routes/admin/product/-hook-invalidate";
export default function FormEditInventory({
  children,
  type,
  data,
  variantId,
}: {
  children: ReactNode;
  type: "create" | "update";
  data: InferResponseType<
    (typeof merchantProductApi.index)["$get"]
  >["items"][0];
  variantId: string;
}) {
  const [open, setOpen] = useState(false);
  const variant = data.variants.find(
    (i) => i.id === variantId
  ) as InferResponseType<
    (typeof merchantProductApi.index)["$get"]
  >["items"][0]["variants"][0];

  const defaultValues = {
    active: variant?.active || false,
    price: variant?.storePrice || 0,
    stock: variant?.stock || 0,
    sku: variant?.sku || "",
    operation: type,
    variantId: variantId,
    id: variant?.inventoryId || crypto.randomUUID(),
  };

  const form = useForm({
    defaultValues,
  });

  const opts = {
    onMutate: () => {
      setOpen(false);
    },
    onError: () => {
      invalidate();
    },

    onSuccess: () => {
      invalidate();
    },
  };
  const mutation = useAPIMutation(merchantInventoryApi.index, "$patch", opts);

  const { invalidate } = useInventoryInvalidate();

  const onSubmit = async (body: typeof defaultValues) => {
    await mutation.mutateAsync({ json: body });
  };
  return (
    <DrawerDialogSwitcher open={open} onOpenChange={setOpen} trigger={children}>
      <DrawerDialogHeader>
        <DrawerDialogTitle>
          {type === "create" ? "Create Inventory" : "Edit Inventory"}
        </DrawerDialogTitle>
      </DrawerDialogHeader>
      <div className="flex items-center gap-4 pb-4">
        <img
          src={data.thumbnail || ""}
          alt={data.title || ""}
          className="size-20 border rounded bg-card border-border/40 object-contain aspect-square"
        />
        <div>
          <p className=" text-base line-clamp-2 break-words">{data?.title}</p>
          <div>
            <span className="text-base font-medium">Category : </span>
            <span>{data?.category}</span>
          </div>
          <div>
            <span className="text-base font-medium">Pack size : </span>
            <span>{variant?.unit}</span>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          <div className="flex items-center justify-between bg-accent/30 rounded border p-4">
            <div>
              <FormLabel>Activate / Deactivate</FormLabel>
              <FormDescription>
                Active products will be shown to customers
              </FormDescription>
            </div>
            <FormSwitch name="active" wrapperClassName="w-fit" />
          </div>
          <FormInput
            label="Selling Price"
            name="price"
            type="number"
            placeholder="0.00"
            required
            prefixEl={<span>₹</span>}
            min={0}
          />
          <FormInput
            name="stock"
            label="Stock Quantity"
            placeholder="0"
            type="number"
            min={-1}
            description="Unlimited stock = -1 | Out of stock = 0 "
          />
          <FormInput name="sku" label="SKU" min={0} />
          <DrawerDialogFooter>
            <FormButton>Save Changes</FormButton>
          </DrawerDialogFooter>
        </form>
      </Form>
    </DrawerDialogSwitcher>
  );
}
