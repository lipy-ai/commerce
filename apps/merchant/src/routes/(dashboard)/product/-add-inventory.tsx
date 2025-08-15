import { merchantInventoryApi, type merchantProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import { DrawerDialogSwitcher } from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { FormInput, FormSwitch } from "@lipy/web-ui/components/forms/elements";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Form, FormLabel } from "@lipy/web-ui/components/ui/form";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import type { InferResponseType } from "hono/client";
import { PencilLine, PenLine } from "lucide-react";
import { useForm } from "react-hook-form";
import FormEdit from "./-form.edit";

type Response = InferResponseType<typeof merchantProductApi.index.$get>;
export function AddInventory({
  items,
  opts,
}: {
  items: Response["items"];
  opts?: any;
}) {
  const { isMobile } = useViewport();

  const mutation = useAPIMutation(
    merchantInventoryApi.index,
    "$patch",
    opts || {}
  );

  const onSubmit = async (
    m: Response["items"][0]["variants"][0] & { inStore: boolean }
  ) => {
    await mutation.mutateAsync({
      json: {
        id: m.inventoryId || crypto.randomUUID(),
        variantId: m.id!,
        sku: m.sku || undefined,
        price: m.price === null ? undefined : Number(m.price),
        stock: m.stock === null ? undefined : Number(m.stock),
        operation: m.inventoryId
          ? "update"
          : m.inventoryId && !m.inStore
            ? "delete"
            : "create",
      },
    });
  };

  if (!items?.length) return null;
  return (
    <div>
      {isMobile ? (
        <MobileView items={items} onSubmit={onSubmit} />
      ) : (
        <DesktopView items={items} onSubmit={onSubmit} />
      )}
    </div>
  );
}

function MobileView({
  items,
  onSubmit,
}: {
  items: Response["items"];
  onSubmit: (
    v: Response["items"][0]["variants"][0] & { inStore: boolean }
  ) => void;
}) {
  return (
    <div className="space-y-1.5">
      {items?.map((m) => (
        <div
          key={m.id}
          className={cn(
            m.status === "underReview" ? "bg-tertiary" : "bg-card",
            "p-4 py-6 space-y-2"
          )}
        >
          <div className=" flex justify-between gap-4">
            <div>
              <div>
                {m.store && (
                  <div className="flex items-center gap-2">
                    <Badge size="sm" variant="warning">
                      Customized
                    </Badge>
                    <FormEdit view={"edit"} product={m.id}>
                      <Button size="icon-xs" variant="ghost">
                        <PencilLine />
                      </Button>
                    </FormEdit>
                  </div>
                )}
                <h3 className="font-semibold text-foreground text-base line-clamp-2 break-words leading-tight">
                  {m.title}
                </h3>
                <p className="text-muted-foreground text-xs truncate">
                  {m.category.title}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 w-20">
              <img
                src={m.thumbnail || ""}
                alt={m.title || ""}
                className={
                  "w-full h-20 border border-border rounded-xl bg-card object-contain ml-auto"
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            {m.status === "underReview" ? (
              <p className="py-6   flex  justify-center text-base font-semibold">
                Product is under review
              </p>
            ) : (
              m.variants?.map((v) => (
                <div
                  key={v.id}
                  className="border  p-2 flex items-center justify-between gap-8 bg-accent/20"
                >
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-medium">Pack:</p>
                      <p>{v?.unit}</p>
                    </div>
                    <div className="flex items-center  gap-1">
                      <p className="font-medium">MRP:</p>
                      <p>{formatAmount("inr", v?.price!)}</p>
                    </div>
                  </div>
                  <DrawerDialogSwitcher
                    trigger={
                      <Button
                        size="xs"
                        variant={v?.inventoryId ? "secondary" : "default"}
                      >
                        {v?.inventoryId ? "Update" : "Add"}
                      </Button>
                    }
                  >
                    <EditInventory variant={v} onSubmit={onSubmit} />
                  </DrawerDialogSwitcher>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopView({
  items,
  onSubmit,
}: {
  items: Response["items"];
  onSubmit: (
    v: Response["items"][0]["variants"][0] & { inStore: boolean }
  ) => void;
}) {
  return (
    <div className="border rounded-xl overflow-y-auto bg-card shadow-xs">
      {items.length > 0 && (
        <div className="border-b px-4 text-base font-medium py-2 bg-accent/30">
          <div className="flex px-4 gap-4">
            <p className="w-24" />
            <p className="flex-2">Products</p>
            <div className="flex-3 grid grid-cols-5  px-6 gap-6">
              <p>Pack size</p>
              <p>MRP</p>
              <p>Price</p>
              <p className="ml-auto">Stock</p>
            </div>
          </div>
        </div>
      )}
      {items.map((m) => (
        <div
          key={m.id}
          className={cn(
            !m.variants ? "py-2" : "",
            "border-b last:border-b-0 px-4"
          )}
        >
          <div
            className={cn(
              m.status === "underReview" && "bg-tertiary -mx-4 px-4",
              "flex items-center gap-4 cursor-pointer"
            )}
          >
            <div>
              <img
                src={m.thumbnail || ""}
                alt={m.title || ""}
                className="size-12 border rounded bg-card object-contain"
              />
            </div>
            <div className="flex-2 flex items-center justify-between gap-2 pr-4">
              <div>
                <p className="font-medium break-words">{m.title}</p>
                <p className="text-muted-foreground text-sm">
                  {m.category.title}
                </p>
              </div>

              {m.store && (
                <FormEdit view={"edit"} product={m.id}>
                  <Button size="icon" variant="outline">
                    <PencilLine />
                  </Button>
                </FormEdit>
              )}
            </div>
            <div className="flex-3">
              {m?.status !== "underReview" ? (
                m?.variants &&
                m.variants.length > 0 && (
                  <div
                    className={cn(
                      m?.variants?.length > 1 && "border-l ",
                      "divide-y"
                    )}
                  >
                    {m.variants.map((v) => (
                      <div key={v.id} className="py-4">
                        <EditInventory variant={v} onSubmit={onSubmit} />
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <p className="py-6   flex  justify-center text-base font-semibold">
                  Product is under review
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EditInventory({
  variant,
  onSubmit,
}: {
  variant: Response["items"][0]["variants"][0];
  onSubmit: (
    v: Response["items"][0]["variants"][0] & { inStore: boolean }
  ) => void;
}) {
  const { isMobile } = useViewport();
  const defaultValues = {
    price: variant?.storePrice || variant?.price || 0,
    inStore: !!variant?.inventoryId || false,
    inStock: variant?.stock !== 0,
  };
  const form = useForm({ defaultValues });
  const handleSubmit = async (v: typeof defaultValues) => {
    if (v.inStock) {
      variant = {
        ...variant,
        stock: -1,
      };
    } else {
      variant = {
        ...variant,
        stock: 0,
      };
    }

    onSubmit({ ...variant, price: v.price, inStore: v.inStore });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid lg:grid-cols-5 items-center lg:px-6  gap-6"
      >
        {isMobile && (
          <div>
            <p>Variant Unit : {variant?.unit}</p>
            <p>MRP : {formatAmount("inr", variant?.price!)}</p>
          </div>
        )}

        <p className="hidden lg:block">{variant?.unit}</p>
        <p className="hidden lg:block">
          {formatAmount("inr", variant?.price!)}
        </p>

        <FormInput
          type="number"
          name="price"
          label={isMobile ? "Price" : ""}
          min={0}
          placeholder="0"
          suffixEl={<PenLine className="size-4" />}
          prefixEl={<span>₹</span>}
          wrapperClassName="-mb-1 "
          className="h-10"
          required
        />
        {isMobile ? (
          <div className="flex items-center justify-between  w-full border rounded bg-accent p-2">
            <FormLabel>Stock</FormLabel>
            <FormSwitch
              name="inStock"
              wrapperClassName={"flex justify-end ml-auto pr-2 -mb-1"}
            />
          </div>
        ) : (
          <FormSwitch
            name="inStock"
            wrapperClassName={"flex justify-end ml-auto pr-2 -mb-1"}
          />
        )}

        <Button
          type="submit"
          className={cn(!isMobile && "ml-auto")}
          disabled={
            variant?.inventoryId
              ? form.formState.isSubmitting ||
                !form.formState.isDirty ||
                form.formState.isSubmitSuccessful
              : false
          }
          variant={variant?.inventoryId ? "secondary" : "default"}
          size={isMobile ? "sm" : "default"}
        >
          {variant?.inventoryId ? "Update" : "Add"}
        </Button>
      </form>
    </Form>
  );
}
