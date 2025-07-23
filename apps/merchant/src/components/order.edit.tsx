import { posOrderApi, posProductApi } from "@lipy/lib/api";
import { orderCalculator } from "@lipy/lib/helper/orderCalculator";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIMutation, useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { FormButton, FormInput } from "@lipy/web-ui/components/forms/elements";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@lipy/web-ui/components/ui/drawer";
import { Form } from "@lipy/web-ui/components/ui/form";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import type { InferRequestType, InferResponseType } from "hono";
import { ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type Item = InferResponseType<typeof posProductApi.index.$get>["items"][0];

type Order = InferResponseType<(typeof posOrderApi)[":id"]["$get"]>["data"];

type OrderItem = InferRequestType<
  typeof posProductApi.index.$post
>["json"]["items"];

type SelectedVariants = Array<{
  product: Item;
  selectedVariant: Item["variants"][0];
}>;

export function OrderEdit({ data }: { data?: Order }) {
  const { isMobile } = useViewport();
  const defaultValues = {
    items: (data?.items || []) as OrderItem,
    taxes: [],
    discounts: [],
  };

  const form = useForm({ defaultValues });

  const items = form.watch("items");

  const itemsArr = useFieldArray({
    control: form.control,
    name: "items",
    keyName: "kid",
  });

  const createMu = useAPIMutation(posOrderApi.index, "$post");
  const updateMu = useAPIMutation(posOrderApi[":id"], "$patch");

  const handleAdd = (v: SelectedVariants[0]) => {
    if (items?.findIndex((f) => f.variantId === v.selectedVariant.id) !== -1)
      return toast.warning("Product already in cart!");

    itemsArr.append({
      title: v.product?.title || "",
      unit: v.selectedVariant.unit || "",
      price: v.selectedVariant?.storePrice || 0,
      maxPrice: v.selectedVariant?.price || 0,
      variantId: v.selectedVariant?.id || "",
      thumbnail: v.selectedVariant?.images?.[0] || v.product?.thumbnail || "",
      qty: 1,
      productId: v.product.id,
      inventoryId: v.selectedVariant?.inventoryId || "",
    });
  };

  const calcs = orderCalculator({
    items: items || [],
    discounts: [],
    taxes: [],
  });

  const handleSubmit = async (v: typeof defaultValues) => {
    if (data) {
      await updateMu.mutateAsync({ param: { id: data.id }, json: v });
    } else {
      await createMu.mutateAsync({ json: { ...v, status: "created" } });
    }
  };

  const ListComp = (
    <ProductList
      selectedVariants={items.map((m) => m.variantId || "")}
      setSelectedVariants={(v) => handleAdd(v)}
    />
  );

  return (
    <div className="grid md:grid-cols-[auto_500px] h-screen">
      {!isMobile && (
        <div className="overflow-y-auto focus:bg-primary/50 md:p-8">
          {ListComp}
        </div>
      )}
      <div className="overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Card className="min-h-screen sticky top">
              <CardHeader>
                <CardTitle>Checkout Summary</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="space-y-4">
                {items.length > 0 ? (
                  <div className="flex gap-2">
                    <Label className="flex flex-1">Items</Label>
                    <Label className="flex w-14 md:w-20 shrink-0 text-center">
                      <span>Qty</span>
                    </Label>
                    <Label className="flex w-20 md:w-26 shrink-0 text-center">
                      <span>Total</span>
                    </Label>
                  </div>
                ) : (
                  !isMobile && (
                    <div className="flex flex-col justify-between items-center pt-8 space-4">
                      <ShoppingBag className="size-12 mb-2" />{" "}
                      <p>No items in cart!</p>
                    </div>
                  )
                )}
                {itemsArr.fields.map((p, i) => {
                  const currItem = items[i];
                  return (
                    <div key={p?.kid} className="flex gap-2 items-center">
                      <div className="relative">
                        <Button
                          size={"xs"}
                          variant={"outline"}
                          className="absolute -left-2 -top-2"
                          type="button"
                          onClick={() => itemsArr.remove(i)}
                        >
                          <Minus />
                        </Button>
                        <div className="aspect-square bg-accent border rounded size-12 overflow-hidden shrink-0">
                          <img
                            src={p.thumbnail || ""}
                            alt={`${p?.title}-${p?.unit || "No Unit"}`}
                            className="size-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <p className="line-clamp-1">{p.title}</p>
                        <p className="flex flex-wrap text-muted-foreground items-center truncate">
                          <Badge variant={"premium"}>
                            {p?.unit || "No Unit"}
                          </Badge>
                          &nbsp;@&nbsp;{formatAmount("INR", p?.price || 0)}
                        </p>
                      </div>
                      <div>
                        <FormInput
                          type="number"
                          name={`items.${i}.qty`}
                          placeholder="0"
                          wrapperClassName="w-14 md:w-20 md:pr-4"
                          min={1}
                        />
                      </div>
                      <div>
                        <p className="text-base w-20 md:w-26 break-all truncate">
                          {formatAmount("INR", p?.price * currItem.qty || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <br />
                {isMobile && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <div className="flex w-full py-4 items-center text-base border justify-center cursor-pointer hover:bg-accent focus:bg-accent rounded disabled-background">
                        <Plus /> <p>Add Product</p>
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="p-0">{ListComp}</DrawerContent>
                  </Drawer>
                )}
                <br />
                <Separator />
                <div className="flex flex-wrap justify-end gap-4 items-center">
                  <Button variant={"outline"} size={"sm"} type="button">
                    <Plus /> Custom Product
                  </Button>
                  <Button variant={"outline"} size={"sm"} type="button">
                    <Plus /> Add Tax
                  </Button>
                  <Button variant={"outline"} size={"sm"} type="button">
                    <Plus /> Add Coupon
                  </Button>
                </div>
                <Separator />
                <div className="flex gap-4 justify-between items-center truncate">
                  <Label className="block">Item Total</Label>
                  <p className="">
                    {formatAmount("INR", calcs.itemsTotal || 0)}
                  </p>
                </div>
                <div className="flex  gap-4 justify-between items-center truncate">
                  <Label className="block">Taxes</Label>
                  <p className="">{formatAmount("INR", calcs.taxTotal || 0)}</p>
                </div>
                <div className="flex  gap-4 justify-between items-center truncate">
                  <Label className="block"> Discount</Label>
                  <p className="">
                    {formatAmount("INR", calcs.discountTotal || 0)}
                  </p>
                </div>
                <div className="flex  gap-4 justify-between items-center truncate">
                  <CardTitle className="block">Total Payable</CardTitle>
                  <p className="text-lg font-bold">
                    {formatAmount("INR", calcs.totalAmount || 0)}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="sticky bottom-0 bg-card mt-auto">
                <div className="flex-1 py-4">
                  <FormButton className="w-full" size={"lg"}>
                    {data ? (
                      "Update Order"
                    ) : (
                      <>
                        {formatAmount("INR", calcs.totalAmount || 0)}{" "}
                        <ArrowRight /> Checkout
                      </>
                    )}
                  </FormButton>
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}

function ProductList({
  selectedVariants,
  setSelectedVariants,
}: {
  selectedVariants: string[];
  setSelectedVariants: (v: SelectedVariants[0]) => void;
}) {
  const { data, isLoading } = useAPIQuery(posProductApi.index, "$get", {
    query: { page: "1", q: "", limit: "50" },
  });
  const [select, setSelect] = useState<Item | null>(null);
  const [dialog, setDialog] = useState<"variant" | null>(null);

  const handleAdd = (product: Item, selectedVariant: Item["variants"][0]) => {
    setSelectedVariants({ product, selectedVariant });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!select) return;

    if (select?.variants?.length > 0) {
      return setDialog("variant");
    }

    handleAdd(select, select.variants?.[0]);

    setSelect(null);
  }, [select]);

  return (
    <>
      <DrawerDialogSwitcher
        open={dialog === "variant"}
        onOpenChange={() => {
          setDialog(null);
          setSelect(null);
        }}
      >
        <DrawerDialogHeader>
          <DrawerDialogTitle>Select Variant</DrawerDialogTitle>
        </DrawerDialogHeader>
        {select?.variants?.map((m) => (
          <Card key={m.id} className="">
            <CardContent className="flex text-base justify-between">
              <div>
                <p>{m.unit}</p>
                <p className="font-semibold">
                  {formatAmount("inr", m.price || 0)}
                </p>
              </div>
              <Button
                className=""
                size={"icon"}
                onClick={() => {
                  handleAdd(select, m);
                  setSelect(null);
                  setDialog(null);
                }}
              >
                <Plus />
              </Button>
            </CardContent>
          </Card>
        ))}
      </DrawerDialogSwitcher>

      <div className="space-y-8 ">
        <div className="flex gap-4">
          <SearchBar className="flex-1" />
        </div>
        {isLoading ? (
          <Skeleton className="size-full flex-1 aspect-square" />
        ) : !data || data?.items?.length === 0 ? (
          <div>
            <p> No products found!</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(100px,_150px))] gap-x-4 gap-y-8">
            {data?.items?.map((d) => {
              const isIncl = d.variants?.some((s) =>
                selectedVariants.includes(s.id || "")
              );
              return (
                <div
                  key={d.id}
                  className="space-y-1"
                  onClick={() => setSelect(d)}
                >
                  <div className="aspect-square relative rounded overflow-hidden cursor-pointer">
                    {isIncl && (
                      <span className="absolute size-full bg-secondary/30 flex justify-center items-center" />
                    )}
                    <div className="absolute right-1 bottom-1">
                      <div className="flex flex-col border bg-background rounded text-center text-xs items-center justify-center">
                        <span className="py-0.5 px-1">
                          <Plus className="size-5" />
                        </span>
                        {d?.variants?.length > 1 && (
                          <span className="text-[10px] border-t py-0 px-1">
                            {d?.variants?.length} Opts
                          </span>
                        )}
                      </div>
                    </div>
                    <img
                      src={d.thumbnail || ""}
                      alt={d.title || ""}
                      className="size-full bg-card rounded object-contain"
                      title={d.title || ""}
                    />
                  </div>
                  <div title={d.title || ""} className="text-xs">
                    <p>
                      <Badge variant={"premium"}>{d.variants[0].unit}</Badge>
                    </p>
                    <p className="truncate">{d.title}</p>
                    <p className="truncate">
                      <span className="font-semibold">
                        {formatAmount("inr", d.variants[0].storePrice || 0) ||
                          "Free"}
                      </span>
                      &nbsp;
                      <span className="text-muted-foreground line-through">
                        {d.variants[0].price &&
                          formatAmount("inr", d.variants[0].price)}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
