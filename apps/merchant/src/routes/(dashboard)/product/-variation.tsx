//@ts-nocheck
import { merchantProductApi } from "@lipy/lib/api";
import {
  apiQueryOptions,
  useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogClose,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { FormButton, FormInput } from "@lipy/web-ui/components/forms/elements";
import { Form } from "@lipy/web-ui/components/ui/form";
import { cn } from "@lipy/web-ui/lib/utils";
import type { InferResponseType } from "hono";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useQueryClient } from "@tanstack/react-query";

export default function ProductVariationForm({
  data,
}: {
  data?: Partial<
    InferResponseType<(typeof merchantProductApi)[":id"]["$get"]>["variants"][0]
  >;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: apiQueryOptions(merchantProductApi[":id"], "$get", {
        param: { id: data?.productId! },
      }).queryKey,
    });
    setOpen(false);
  };

  const updateMutation = useAPIMutation(merchantProductApi[":id"], "$patch", {
    onSuccess,
  });
  const insertMutation = useAPIMutation(merchantProductApi, "$post", {
    onSuccess,
  });

  const defaultValues = {
    price: data?.price || 0,
    unit: data?.unit || "",
    images: data?.images || [],
  };

  const form = useForm({
    defaultValues,
  });

  const handle = async (d: typeof defaultValues) => {
    const json = { ...d, productId: data?.productId! };
    data?.id
      ? await updateMutation.mutateAsync({ json, param: { id: data?.id! } })
      : await insertMutation.mutateAsync({ json });
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={cn(
          "text-sm border relative cursor-pointer hover:bg-accent p-4",
          !data?.id && "border-dashed"
        )}
      >
        <div className="text-sm md:text-base flex justify-between items-center">
          {data?.images?.[0] && (
            <div>
              <img
                className=""
                src={data?.images?.[0]}
                alt={`Variant - ${data?.unit}`}
              />
            </div>
          )}
          {data?.unit && (
            <div>
              <span>{data?.unit}</span>
            </div>
          )}
          <div className={cn("flex gap-1")}>
            {!data?.id ? <Plus /> : "₹"}
            <span>{!data?.id ? "Add New Variant" : data?.price}</span>
          </div>
        </div>
      </div>
      <DrawerDialogSwitcher open={open} onOpenChange={setOpen}>
        <DrawerDialogHeader>
          <DrawerDialogTitle>
            {!data ? "Add Variant" : "Edit Variant"}
          </DrawerDialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handle)} className="grid gap-8">
              <div className="grid">
                <>
                  <FormInput name="unit" label="Unit" placeholder="500 ml" />
                  <FormInput
                    name="price"
                    label="Price"
                    placeholder="0"
                    type="number"
                    min={0}
                  />
                </>
              </div>
              <DrawerDialogFooter>
                <DrawerDialogClose />
                <FormButton>Save Changes</FormButton>
              </DrawerDialogFooter>
            </form>
          </Form>
        </DrawerDialogHeader>
      </DrawerDialogSwitcher>
    </>
  );
}
