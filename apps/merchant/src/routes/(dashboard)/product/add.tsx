import { merchantInventoryApi, merchantProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
  apiQueryOptions,
  useAPIMutation,
  useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import { DrawerDialogSwitcher } from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { FormInput, FormSwitch } from "@lipy/web-ui/components/forms/elements";
import { SearchInput } from "@lipy/web-ui/components/forms/searchInput";
import {
  DashboardHeader,
  useLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Form, FormLabel } from "@lipy/web-ui/components/ui/form";
import { Label } from "@lipy/web-ui/components/ui/label";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { InferResponseType } from "hono";
import { produce } from "immer";
import { CheckCircle, PencilLine, PenLine, Plus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormEdit from "./-form.edit";
export const Route = createFileRoute("/(dashboard)/product/add")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1).default(1),
    q: z.string().default(""),
    category: z.string().optional(),
    product: z.string().uuid().optional(),
    view: z.enum(["edit", "assign", "delete", "create"]).optional(),
  }),
});

type Response = InferResponseType<typeof merchantProductApi.index.$get>;

function RouteComponent() {
  const { page, q, category } = Route.useSearch();
  const { addFooter, removeFooter } = useLayout();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const { isMobile } = useViewport();

  const query = {
    page: String(page),
    limit: String(10),
    q,
    showAll: "true",
    category,
  };
  const { data, isLoading } = useAPIQuery(
    merchantProductApi.index,
    "$get",
    {
      query,
    },
    {
      placeholderData: (p) => p,
    }
  );

  const mutation = useAPIMutation(merchantInventoryApi.index, "$patch", {
    onMutate({ json }) {
      queryClient.setQueryData(
        apiQueryOptions(merchantProductApi.index, "$get", {
          query,
        }).queryKey,
        (prev: typeof data) =>
          produce(prev, (draft) => {
            if (!draft) return draft;

            let variantIdx = -1;
            const productIdx = draft.items.findIndex((product) => {
              const idx = product.variants?.findIndex(
                (variant) => variant.id === json.variantId
              );
              if (Number(idx) >= 0) {
                variantIdx = idx;
                return true;
              }
              return false;
            });
            if (productIdx !== -1 && variantIdx !== -1) {
              const variant = draft.items[productIdx].variants[variantIdx];
              draft.items[productIdx].variants[variantIdx] =
                json.operation !== "delete"
                  ? {
                      ...variant,
                      inventoryId: json.id,
                      storePrice: Number(json.price),
                      stock: Number(json.stock),
                      sku: json.sku || null,
                    }
                  : {
                      ...variant,
                      storePrice: null,
                      stock: null,
                      sku: null,
                      inventoryId: null,
                    };
            }

            return draft;
          })
      );
    },

    onError(err) {
      console.error(err);
    },
  });

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

  const [updates, setUpdates] = useState<Response["items"][0]["variants"]>([]);

  const SaveBtn = () => (
    <Card className="">
      <CardContent className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 drop-shadow">
        <div className="flex gap-4 w-full md:w-auto">
          <Button className="flex-1">
            <CheckCircle />
            Save {updates.length} Changes
          </Button>

          <Button
            className="flex-1"
            // size={"icon"}
            variant={"outline"}
            onClick={() => setUpdates([])}
          >
            <XCircle /> Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (updates.length > 0) {
      addFooter({ id: "save-btn", node: <SaveBtn /> });
    } else {
      removeFooter("save-btn");
    }
    return () => {
      removeFooter("save-btn");
    };
  }, [updates]);

  return (
    <div>
      <DashboardHeader title="Add Products">
        <Button
          onClick={() =>
            navigate({
              to: "/product/add",
              search: (s) => ({ ...s, view: "create" }),
              replace: true,
            })
          }
          size={isMobile ? "icon" : "default"}
        >
          <Plus />
          {!isMobile && "Add My Product"}
        </Button>
      </DashboardHeader>

      <FormEdit />

      <div className="lg:p-8 lg:space-y-8">
        <div className="p-4 lg:p-0">
          <div className="e lg:p-0 flex flex-col lg:flex-row items-center gap-2">
            <SearchInput
              type="categories"
              value={category || ""}
              onChange={(v) =>
                navigate({ search: (p) => ({ ...p, category: v || "" }) })
              }
              placeholder={"Select Category"}
              name={"Category"}
              className="lg:w-fit"
            />
            <SearchBar
              placeholder="Search products"
              defaultValue={q}
              className="flex-1 w-full lg:w-auto p-0"
            />
          </div>
        </div>
        {isLoading ? null : !data || data.items.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex flex-1 justify-center flex-col items-center m-auto min-h-[60vh]  text-center">
              <img
                src="/assets/no-results-found.png"
                alt="no-result-found"
                className="size-40 lg:size-48 object-cover"
              />
              <Label className="text-lg lg:text-xl pt-2">
                No products found {q ? `for "${q}"` : ""}
              </Label>
            </CardContent>
          </Card>
        ) : (
          <>
            {isMobile ? (
              // <div className="grid md:grid-cols-3 2xl:grid-cols-3  divide-x divide-y border">
              //   {data.items.map((m, i) => (
              //     <SingProduct product={m} key={i} onSubmit={onSubmit} />
              //   ))}
              // </div>
              <MobileView items={data.items} onSubmit={onSubmit} />
            ) : (
              <DesktopView items={data.items} onSubmit={onSubmit} />
            )}
            <Pagination {...data} />
          </>
        )}
      </div>
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
  const navigate = Route.useNavigate();
  return (
    <div className="space-y-1.5">
      {items?.map((m) => (
        <div
          key={m.id}
          className={cn(
            m.status === "underReview" ? "bg-muted-foreground/10" : "bg-card",
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
                    <Button
                      onClick={() =>
                        navigate({
                          to: "/product/add",
                          search: (s) => ({
                            ...s,
                            view: "edit",
                            product: m.id,
                          }),
                          replace: true,
                        })
                      }
                      size="icon-xs"
                      variant="ghost"
                    >
                      <PencilLine />
                    </Button>
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
                    trigger={<Button size="xs">Add</Button>}
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
  const navigate = Route.useNavigate();
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
              m.status === "underReview" && "bg-muted-foreground/20 -mx-4 px-4",
              "flex items-center gap-4"
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
                <Button
                  onClick={() =>
                    navigate({
                      to: "/product/add",
                      search: (s) => ({ ...s, view: "edit", product: m.id }),
                      replace: true,
                    })
                  }
                  size="icon"
                  variant="outline"
                >
                  <PencilLine />
                </Button>
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

// function SingProduct({
//   product,
//   onSubmit,
// }: {
//   product: Response["items"][0];
//   onSubmit: (
//     v: Response["items"][0]["variants"][0] & { inStore: boolean }
//   ) => void;
// }) {
//   const m = product;
//   return (
//     <div className="space-y-8  p-8 border-r" key={m.id}>
//       <div className="flex gap-4">
//         <div className="size-14 overflow-hidden">
//           <img
//             src={m.thumbnail || ""}
//             alt={m.title || ""}
//             className="size-full object-contain rounded border border-border/40 bg-card"
//           />
//         </div>
//         <div className="flex-1">
//           <p className="font-semibold">{m.title}</p>
//           <p className="line-clamp-2"> {m.summary}</p>
//           <p className="line-clamp-2"> {m.category.title}</p>
//         </div>
//       </div>
//       <div className="flex-1">
//         <div className="grid gap-6">
//           {!m.variants || m.variants?.length === 0 ? (
//             <div className="p-4 text-base gap-2 items-center border flex justify-between">
//               <span>No Variants Yet....</span>
//               <Button variant={"link"} className="text-base">
//                 Raise Request
//               </Button>
//             </div>
//           ) : (
//             m.variants?.map((v, i) => {
//               // const isActive = activeIds.includes(v.id || "");
//               return <EditVariation data={v} key={i} onSubmit={onSubmit} />;
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function EditVariation({
//   data,
//   onSubmit,
// }: {
//   data: Response["items"][0]["variants"][0];
//   onSubmit: (
//     v: Response["items"][0]["variants"][0] & { inStore: boolean }
//   ) => void;
// }) {
//   const [open, setOpen] = useState(false);

//   const defaultValues = {
//     inStore: !!data.inventoryId || false,
//     price: data?.storePrice || data?.price || 0,
//     stock: data?.stock || 0,
//     sku: data?.sku || "",
//   };

//   const form = useForm({
//     defaultValues,
//   });

//   const isActivated = form.watch("inStore");

//   const handle = async (body: typeof defaultValues) => {
//     onSubmit({ ...data, ...body });

//     setOpen(false);
//   };

//   return (
//     <>
//       <div
//         onClick={() => setOpen(true)}
//         className={cn("text-sm border border-primary/30 relative")}
//       >
//         <p
//           className={cn(
//             "absolute before:absolute before:-z-10 before:-inset-1 before:block before before:bg-primary/20 after:absolute after:-z-20 after:-inset-1 after after:block after:bg-white -top-3 z-10 inline-flex text-foreground bg-white text-xs px-2",
//             data.stock &&
//               data.stock !== 0 &&
//               "before:bg-primary text-primary-foreground"
//           )}
//         >
//           {data?.unit}
//         </p>
//         <div className="text-sm md:text-base">
//           <div
//             className={cn(
//               "flex has-[input:focus]:bg-muted overflow-hidden h-12",
//               data.inventoryId ? "" : "disabled-background"
//             )}
//           >
//             <span className="pl-2 flex items-center justify-center text-muted-foreground">
//               ₹
//             </span>
//             <span className="flex flex-1 flex-col px-2 h-12 justify-center">
//               {data?.storePrice || data?.price}
//             </span>
//             {/* <Editable.Root
// 												defaultValue={String(v.price)}
// 												onValueChange={(val) => {
// 													String(val) !== String(v.price) &&
// 														updateInventory({ ...v, price: Number(val) });
// 												}}
// 												placeholder="0"
// 												triggerMode="focus"
// 												className="flex w-full"
// 											>
// 												<Editable.Area className="flex flex-1 flex-col px-2 h-12 justify-center">
// 													<Editable.Preview className="" />
// 													<Editable.Input type="number" className="w-full " />
// 													<Editable.Trigger />
// 												</Editable.Area>
// 											</Editable.Root> */}
//             {/* <StockToggle />
// 											<EditVariation /> */}
//           </div>
//         </div>
//         <div
//           className={cn(
//             "bg-accent/50 border-t border-accent text-sm px-2 py-0.5 flex justify-between gap-4 flex-wrap font-light",
//             data.stock &&
//               data.stock !== 0 &&
//               "bg-primary text-primary-foreground"
//           )}
//         >
//           <div className="flex">
//             <span>
//               {!data.storePrice
//                 ? "Inactive"
//                 : !data?.stock
//                   ? "Out of Stock"
//                   : data?.stock === -1
//                     ? "In Stock"
//                     : data?.stock > 0
//                       ? `${data?.stock} left`
//                       : "-"}
//             </span>
//           </div>
//           {data.sku && (
//             <div className="flex">
//               <span>SKU: {data?.sku || "-"}</span>
//             </div>
//           )}
//         </div>
//       </div>
//       <DrawerDialogSwitcher open={open} onOpenChange={setOpen}>
//         <DrawerDialogHeader>
//           <DrawerDialogTitle>Edit Variant</DrawerDialogTitle>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(handle)} className="grid gap-8">
//               <div className="grid">
//                 <div className="flex gap-4 flex-row items-center justify-between rounded-lg border p-3 my-4 shadow-sm">
//                   <div className="space-y-0.5 flex-1">
//                     <FormLabel>Activate / Deactivate</FormLabel>
//                     <FormDescription>Do you sell this variant?</FormDescription>
//                   </div>
//                   <FormSwitch name="inStore" wrapperClassName="w-fit" />
//                 </div>
//                 {isActivated && (
//                   <>
//                     <FormInput
//                       name="price"
//                       label="Price"
//                       placeholder="0"
//                       type="number"
//                       min={0}
//                     />
//                     <FormInput
//                       name="stock"
//                       label="Stock Quantity"
//                       placeholder="0"
//                       type="number"
//                       min={-1}
//                     />
//                     <FormInput name="sku" label="SKU" min={0} />
//                   </>
//                 )}
//               </div>
//               <DrawerDialogFooter>
//                 <DrawerDialogClose />
//                 <FormButton>Save Changes</FormButton>
//               </DrawerDialogFooter>
//             </form>
//           </Form>
//         </DrawerDialogHeader>
//       </DrawerDialogSwitcher>
//     </>
//   );
// }
