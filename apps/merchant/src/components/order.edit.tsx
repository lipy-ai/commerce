import { posOrderApi, posProductApi } from "@lipy/lib/api";
import { orderCalculator } from "@lipy/lib/helper/orderCalculator";
import { formatAmount, formatPercent } from "@lipy/lib/utils/intl";
import { useAPIMutation, useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import {
  FormButton,
  FormDropdown,
  FormInput,
} from "@lipy/web-ui/components/forms/elements";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { DialogHeader } from "@lipy/web-ui/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTrigger,
} from "@lipy/web-ui/components/ui/drawer";
import { Form } from "@lipy/web-ui/components/ui/form";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import type { InferRequestType, InferResponseType } from "hono";
import { ArrowRight, Check, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type Item = InferResponseType<typeof posProductApi.index.$get>["items"][0];

type Order = InferResponseType<(typeof posOrderApi)[":id"]["$get"]>;

type UpdateOrderReq = InferRequestType<typeof posOrderApi.index.$post>["json"];

type SelectedVariants = Array<{
  product: Item;
  selectedVariant: Item["variants"][0];
}>;

export function OrderEdit({ data }: { data?: Order }) {
  const { isMobile } = useViewport();
  const [open, setOpen] = useState<"product" | "tax" | "discount" | null>(null);
  const defaultValues: UpdateOrderReq = {
    items: (data?.items as any) || [],
    taxes: [],
    discounts: [],
    status: "created",
  };

  const form = useForm({ defaultValues });

  const items = form.watch("items");
  const taxes = form.watch("taxes");
  const discounts = form.watch("discounts");

  const itemsArr = useFieldArray({
    control: form.control,
    name: "items",
    keyName: "kid",
  });

  const taxesArr = useFieldArray({
    control: form.control,
    name: "taxes",
    keyName: "kid",
  });

  const discountsArr = useFieldArray({
    control: form.control,
    name: "discounts",
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
    discounts: discounts || [],
    taxes: taxes || [],
  });

  const handleSubmit = async (v: typeof defaultValues) => {
    if (data) {
      await updateMu.mutateAsync({
        param: { id: data.id },
        json: { type: "update", ...v },
      });
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
      <DrawerDialogSwitcher open={form.formState.isSubmitSuccessful}>
        <DrawerDialogHeader className="flex justify-center items-center">
          <span className="p-4 bg-primary text-primary-foreground w-fit rounded-full m-auto">
            <Check />
          </span>
          <DrawerDialogTitle>Order Successful</DrawerDialogTitle>
          <DrawerDescription>Order was successfully created.</DrawerDescription>
        </DrawerDialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back
          </Link>
          <Button onClick={() => form.reset()}>New Order</Button>
        </div>
      </DrawerDialogSwitcher>
      {!isMobile && (
        <div className="overflow-y-auto focus:bg-primary/50 md:p-8">
          {ListComp}
        </div>
      )}
      <CustomProduct
        onSubmit={(v) => itemsArr.append(v)}
        open={open === "product"}
        setOpen={() => setOpen(null)}
      />
      <AddTax
        onSubmit={(v) => taxesArr.append(v)}
        open={open === "tax"}
        setOpen={() => setOpen(null)}
      />
      <AddCoupon
        onSubmit={(v) => discountsArr.append(v)}
        open={open === "discount"}
        setOpen={() => setOpen(null)}
      />
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
                    <Label className="flex w-14 md:w-20 shrink-0 text-center justify-center">
                      <span>Qty</span>
                    </Label>
                    <Label className="flex w-20 md:w-26 shrink-0 text-end justify-end">
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
                          <X />
                        </Button>
                        <div className="aspect-square bg-accent border rounded size-12 overflow-hidden shrink-0">
                          <img
                            src={
                              p.thumbnail ||
                              "https://api.dicebear.com/9.x/glass/svg"
                            }
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
                          wrapperClassName="w-14 md:w-20"
                          min={1}
                        />
                      </div>
                      <div>
                        <p className="w-20 md:w-26 text-end break-all truncate">
                          {formatAmount("INR", p?.price * currItem.qty || 0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isMobile && (
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant={"outline"}>
                        {" "}
                        <Plus /> <p>Add Product</p>
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-0">{ListComp}</DrawerContent>
                  </Drawer>
                )}
                <br />
                {taxesArr.fields.length > 0 && (
                  <>
                    <Separator />
                    <Label>Taxes</Label>

                    {taxesArr.fields.map((p, i) => (
                      <div key={p.kid} className="flex gap-4">
                        <Button
                          size={"xs"}
                          variant={"outline"}
                          type="button"
                          onClick={() => taxesArr.remove(i)}
                        >
                          <X />
                        </Button>
                        <div className="flex justify-between flex-1">
                          <p> {p.name || "Unknown Tax"}</p>{" "}
                          <p className="">
                            {p.sum === "percent"
                              ? formatPercent(p.amount)
                              : formatAmount("inr", p.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {discountsArr.fields.length > 0 && (
                  <>
                    <Separator />

                    <Label>Discount</Label>
                    {discountsArr.fields.map((p, i) => (
                      <div key={p.kid} className="flex gap-4">
                        <Button
                          size={"xs"}
                          variant={"outline"}
                          type="button"
                          onClick={() => discountsArr.remove(i)}
                        >
                          <X />
                        </Button>
                        <div className="flex justify-between flex-1">
                          <p> {p.name || "Unknown Discount"}</p>
                          <p className="">
                            {p.sum === "percent"
                              ? formatPercent(p.amount)
                              : formatAmount("inr", p.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <br />
                <Separator />

                <div className="flex flex-wrap gap-4 items-center">
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setOpen("product")}
                  >
                    <Plus /> Custom Product
                  </Button>
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setOpen("tax")}
                  >
                    <Plus /> Add Tax
                  </Button>
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={() => setOpen("discount")}
                  >
                    <Plus /> Add Discount
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
                    {formatAmount("INR", -calcs.discountTotal || 0)}
                  </p>
                </div>
                <div className="flex  gap-4 justify-between items-center truncate">
                  <CardTitle className="block">Total Payable </CardTitle>
                  <p className="text-lg font-bold text-end">
                    {formatAmount("INR", calcs.totalAmount || 0)}
                    {calcs.totalSaved ? (
                      <Badge
                        size={"small"}
                        variant={"success"}
                        className="block"
                      >
                        Saved {formatAmount("INR", calcs.totalSaved || 0)}
                      </Badge>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="sticky bottom-0 bg-card mt-auto">
                <div className="flex-1 py-4">
                  <FormButton className="w-full" size={"lg"}>
                    {data ? (
                      "Update Order"
                    ) : (
                      <span className="flex gap-2 items-center">
                        <span>
                          {formatAmount("INR", calcs.totalAmount || 0)}
                        </span>{" "}
                        <ArrowRight /> <span>Checkout</span>
                      </span>
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
    console.log(select?.variants);
    if (select?.variants?.length > 1) {
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

function CustomProduct({
  onSubmit,
  open,
  setOpen,
}: {
  onSubmit: (
    v: Pick<UpdateOrderReq["items"][number], "title" | "price" | "qty" | "unit">
  ) => void;
  open: boolean;
  setOpen: (b: boolean) => void;
}) {
  const defaultValues = {
    title: "",
    price: 10,
    qty: 1,
    unit: "1 Pc",
  };
  const form = useForm({ defaultValues });

  return (
    <DrawerDialogSwitcher open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => {
            onSubmit(v);
            setOpen(false);
            form.reset();
          })}
        >
          <DrawerDialogHeader>
            <DrawerDialogTitle>Add Custom Product</DrawerDialogTitle>
          </DrawerDialogHeader>
          <div>
            <FormInput name="title" label="Product Title" />
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="qty" label="Total Qty" type="number" min={1} />
              <FormInput
                name="price"
                label="Unit Price"
                type="number"
                min={0}
              />
            </div>
          </div>
          <FormButton>Add Product</FormButton>
        </form>
      </Form>
    </DrawerDialogSwitcher>
  );
}

function AddCoupon({
  onSubmit,
  open,
  setOpen,
}: {
  onSubmit: (v: UpdateOrderReq["discounts"][number]) => void;
  open: boolean;
  setOpen: (b: boolean) => void;
}) {
  const defaultValues: UpdateOrderReq["discounts"][0] = {
    name: "",
    amount: 0,
    sum: "percent",
  };
  const form = useForm({ defaultValues });

  return (
    <DrawerDialogSwitcher open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => {
            onSubmit(v);
            setOpen(false);
            form.reset();
          })}
        >
          <DrawerDialogHeader>
            <DrawerDialogTitle>Add Discount</DrawerDialogTitle>
          </DrawerDialogHeader>
          <div className="">
            <FormInput name="name" label="Title" />
            <div className="grid grid-cols-3 gap-4">
              <FormInput
                wrapperClassName="col-span-2 block"
                name="amount"
                label="Amount"
                type="number"
              />
              <FormDropdown
                name="sum"
                label="Sum"
                wrapperClassName="block"
                opts={[
                  { value: "flat", label: "(+/-) Flat" },
                  { value: "percent", label: "(%) Percent" },
                ]}
              />
            </div>
          </div>
          <FormButton>Add Discount</FormButton>
        </form>
      </Form>
    </DrawerDialogSwitcher>
  );
}

function AddTax({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  onSubmit: (v: UpdateOrderReq["taxes"][number]) => void;
}) {
  const defaultValues: UpdateOrderReq["taxes"][0] = {
    name: "",
    amount: 0,
    sum: "percent",
  };
  const form = useForm({ defaultValues });

  return (
    <DrawerDialogSwitcher open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => {
            onSubmit(v);
            setOpen(false);
            form.reset();
          })}
        >
          <DrawerDialogHeader>
            <DrawerDialogTitle>Add Tax</DrawerDialogTitle>
          </DrawerDialogHeader>
          <div className="">
            <FormInput name="name" label="Title" />
            <div className="grid grid-cols-3 gap-4">
              <FormInput
                wrapperClassName="col-span-2 block"
                name="amount"
                label="Amount"
                type="number"
              />
              <FormDropdown
                name="sum"
                label="Sum"
                wrapperClassName="block"
                opts={[
                  { value: "flat", label: "(+/-) Flat" },
                  { value: "percent", label: "(%) Percent" },
                ]}
              />
            </div>
          </div>
          <FormButton>Add Tax</FormButton>
        </form>
      </Form>
    </DrawerDialogSwitcher>
  );
}
