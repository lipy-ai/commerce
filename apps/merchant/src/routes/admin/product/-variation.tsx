import { adminVariantApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIMutation, useAPIQuery } from "@lipy/lib/utils/useQueryClient";

import {
  DrawerDialogClose,
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
import { SearchInput } from "@lipy/web-ui/components/forms/searchInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Form, FormLabel } from "@lipy/web-ui/components/ui/form";
import Loading from "@lipy/web-ui/components/ui/loading";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";

export default function AssignProductVariationForm() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate({ from: "/admin/product" });
  const { shop, product, view } = useSearch({ from: "/admin/product/" });

  const { data, isLoading } = useAPIQuery(
    adminVariantApi[":productId"],
    "$get",
    { param: { productId: product! }, query: { storeId: shop! } },
    { enabled: !!product && !!shop }
  );

  const mutation = useAPIMutation(adminVariantApi.inventory, "$patch", {
    onSuccess: () => {
      toast.success("Inventory updated");
    },
  });

  const d = {
    id: "",
    price: 0,
    stock: 0,
    active: false,
    storeId: shop || "",
    variantId: "",
  };
  const defaultValues: { items: Array<typeof d> } = { items: [d] };

  const form = useForm<typeof defaultValues>({
    defaultValues,
  });

  const handle = async (d: typeof defaultValues) => {
    const dirtyItems = form.formState.dirtyFields.items;

    const json = {
      items: d.items.filter((_, i) => !!dirtyItems?.[i]),
    };

    await mutation.mutateAsync({ json });
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!data || data?.length === 0) return;
    form.reset(
      {
        items: data?.map((m) => ({
          id: m?.inventory?.id || crypto.randomUUID(),
          price: m?.inventory?.price || 0,
          stock: m?.inventory?.stock || 0,
          active: m?.inventory?.active || false,
          storeId: m?.inventory?.storeId || shop,
          variantId: m?.id || "",
        })),
      },
      { keepDirtyValues: false }
    );
  }, [data]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (view === "assign") {
      setOpen(true);
    }
    return () => form.reset(defaultValues);
  }, [view]);

  return (
    <DrawerDialogSwitcher
      open={open}
      onOpenChange={(v) => {
        setOpen(v);

        if (!v) {
          navigate({
            search: (s) => ({ ...s, view: undefined, product: undefined }),
          });
          form.reset(defaultValues);
        }
      }}
    >
      <DrawerDialogHeader>
        <DrawerDialogTitle>Variants</DrawerDialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handle)} className="grid gap-4">
            <SearchInput
              name="store-select"
              type="stores"
              placeholder="Select Store"
              value={shop || ""}
              onChange={(v) =>
                navigate({ search: (s: any) => ({ ...s, shop: v }) } as any)
              }
            />
            <Separator />
            {isLoading ? (
              <Loading className="max-h-[300px]" />
            ) : !data || data.length === 0 ? (
              <div className="flex">
                <p>No Variants found!</p>
              </div>
            ) : (
              data?.map((d, i) => (
                <div key={d.id} className="flex items-end gap-4">
                  <div className="h-full flex-1 flex flex-col gap-2">
                    <Badge>{d.unit}</Badge>
                    <Badge variant="info" className="h-10">
                      Max {formatAmount("inr", d.price)}
                    </Badge>
                  </div>
                  <div className="w-1/3">
                    <FormInput label="Price" name={`items.${i}.price`} />
                  </div>
                  <div className="w-1/4">
                    <FormInput label="Stock" name={`items.${i}.stock`} />
                  </div>
                  <div className="w-14">
                    <FormSwitch label="Active" name={`items.${i}.active`} />
                  </div>
                </div>
              ))
            )}

            {!isLoading && (
              <DrawerDialogFooter>
                <DrawerDialogClose />
                <FormButton disabled={isLoading}>Save Changes</FormButton>
              </DrawerDialogFooter>
            )}
          </form>
        </Form>
      </DrawerDialogHeader>
    </DrawerDialogSwitcher>
  );
}

export function VariantForm() {
  const label = "Variants";
  const name = "variants";
  const form = useFormContext();
  const arr = useFieldArray({
    name,
    control: form.control,
    keyName: "kid",
  });
  const watch = form.watch(name);

  return (
    <div className="mt-8">
      <div className="flex justify-between p-4 bg-accent/50">
        <FormLabel>{label}</FormLabel>

        <Button
          variant={"outline"}
          size={"sm"}
          type="button"
          onClick={() => {
            arr.prepend({
              unit: "Untitled",
              price: 0,
              id: crypto.randomUUID(),
              images: [],
            });
          }}
        >
          Add New
        </Button>
      </div>
      <Accordion type="single" collapsible>
        {arr.fields.map((m, i) => (
          <AccordionItem
            key={m.kid}
            value={m.kid}
            className="hover:bg-accent/50 data-[state=open]:bg-accent/20 data-[state=open]:border"
          >
            <AccordionTrigger className="data-[state=open]:border-b">
              <div className="flex gap-2 items-center w-full">
                <div className="text-start flex gap-2 flex-1 px-4">
                  <p className="">{watch[i]?.unit}</p> <ArrowRight />
                  <p className="text-muted-foreground">
                    {formatAmount("INR", watch[i]?.price || 0)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    arr.remove(i);
                  }}
                >
                  <Trash />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <FormInput
                name={`${name}.${i}.unit`}
                label="Unit"
                placeholder="500 ml"
              />
              <FormInput
                name={`${name}.${i}.price`}
                label="Price"
                placeholder="0"
                type="number"
                min={0}
              />
              <FormInput
                name={`${name}.${i}.maxPrice`}
                label="Max Price"
                placeholder="0"
                type="number"
                min={0}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
