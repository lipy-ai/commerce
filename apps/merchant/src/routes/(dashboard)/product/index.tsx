import { merchantProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { Switch } from "@lipy/web-ui/components/ui/switch";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { ChevronRight, Edit, Eye, Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { ProductPreview } from "./-preview";

export const Route = createFileRoute("/(dashboard)/product/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    q: z.string().default(""),
    category: z.string().optional(),
    product: z.string().uuid().optional(),
    view: z.enum(["edit", "assign", "delete", "create"]).optional(),
    type: z.enum(["category", "product"]).optional(),
  }),
});

type Response = InferResponseType<typeof merchantProductApi.index.$get>;

function RouteComponent() {
  const { isMobile } = useViewport();
  const { page, q, category } = Route.useSearch();
  // const navigate = Route.useNavigate();

  const { data, isLoading } = useAPIQuery(
    merchantProductApi.index,
    "$get",
    {
      query: { page: String(page), limit: String(10), q, category },
    },
    {
      placeholderData: (p) => p,
    }
  );

  console.log(data);

  return (
    <>
      <DashboardHeader title="Menu">
        <AddOptions>
          <Button size={"sm"}>
            {" "}
            <Plus />
            ADD
          </Button>
        </AddOptions>
      </DashboardHeader>

      <div className="lg:p-8 lg:space-y-8 flex flex-col flex-1">
        <div className="p-4 lg:p-0 flex flex-col lg:flex-row items-center gap-2">
          {/* <SearchInput
            type="categories"
            value={category || ""}
            onChange={(v) =>
              navigate({ search: (p) => ({ ...p, category: v || "" }) })
            }
            placeholder={"Select Category"}
            name={"Category"}
            className="lg:w-fit"
          /> */}
          <SearchBar
            placeholder="Search items"
            defaultValue={q}
            className="flex-1 w-full lg:w-auto p-0"
          />
        </div>
        {isLoading ? (
          <Skeleton className="flex-1 mx-4 lg:mx-0" />
        ) : !data || data.items.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex flex-1 justify-center flex-col items-center m-auto min-h-[60vh]  text-center">
              <img
                src={
                  q ? "/assets/no-results-found.png" : "/assets/no-product.png"
                }
                alt="no-product"
                className="size-40 lg:size-48 object-cover"
              />

              {q ? (
                <h1 className="text-lg lg:text-2xl  font-medium pt-2">
                  No items found for "{q}"
                </h1>
              ) : (
                <div>
                  <h1 className="text-lg lg:text-xl  font-medium">
                    Your inventory will appear here
                  </h1>
                  <p className="text-muted-foreground lg:text-base max-w-[450px] pb-4">
                    View and manage your inventory and add products to your
                    inventory with simple clicks
                  </p>
                  <AddOptions>
                    <Button size={"sm"}>
                      {" "}
                      <Plus />
                      Add items
                    </Button>
                  </AddOptions>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* <AddInventory
              items={data.items.filter(
                (m) =>
                  m.status === "underReview" ||
                  (m.status === "published" &&
                    m.variants.some((v) => !v.inventoryId))
              )}
              opts={{
                onSuccess() {
                  toast.success("Inventory updated");
                },
              }}
            /> */}
            {isMobile ? (
              <MobileView items={data?.items} />
            ) : (
              // <DesktopView items={data.items} />
              <>Hello</>
            )}
            {/* <Pagination {...data} /> */}
          </>
        )}
      </div>
    </>
  );
}

function MobileView({ items }: { items: Response["items"] }) {
  return (
    <div className="space-y-2 my-4">
      {items.map((m) => (
        <Accordion
          key={m.id}
          type="single"
          collapsible
          defaultValue="item-1"
          className="pr-4 bg-card"
        >
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="hover:no-underline break-words">
              <p className="font-semibold text-lg border-l-4 px-3 border-red-600">
                {m.title} ({m.products.length})
              </p>
            </AccordionTrigger>

            <AccordionContent className="pl-4 py-4 divide-y divide-dashed">
              {m.products[0] &&
                m.products.map((p) => (
                  <div key={p.id} className="py-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="font-medium text-base">{p.title}</p>

                        {p.variants && (
                          <p>{formatAmount("inr", p.variants[0].price || 0)}</p>
                        )}

                        <p
                          className="text-muted-foreground text-xs line-clamp-4 break-words
                      "
                        >
                          {p.summary}
                        </p>
                      </div>

                      <div>
                        <img
                          src={p.thumbnail || "/assets/placeholder-image.svg"}
                          alt={p.title || ""}
                          className="flex-shrink-0 size-28 rounded-xl border-2"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Link
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "has-[>svg]:px-0"
                        )}
                        to="/product/add"
                        search={{ product: p.id as string, type: "product" }}
                      >
                        <Edit /> Edit
                      </Link>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={p.variants?.some((v) => v.inStock) ?? false}
                          className="data-[state=checked]:bg-green-600 "
                        />
                        <p>
                          {" "}
                          {p.variants?.some((v) => v.inStock)
                            ? "In Stock"
                            : "Out of Stock"}
                        </p>
                      </div>

                      <ProductPreview product={p}>
                        <Button
                          variant={"ghost"}
                          size="sm"
                          className="has-[>svg]:px-0"
                        >
                          <Eye /> Preview
                        </Button>
                      </ProductPreview>
                    </div>
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}

// function DesktopView({ items }: { items: Response["items"] }) {
//   return (
//     <div className="border rounded-xl overflow-y-auto bg-card shadow-xs">
//       {items.length > 0 && (
//         <div className="border-b px-4 text-base font-medium py-2 bg-accent/30">
//           <div className="flex px-4 gap-4">
//             <p className="w-24" />
//             <p className="flex-2">Products</p>
//             <div className="flex-3 grid grid-cols-5  px-6 gap-6">
//               <p>Status</p>
//               <p>Stock</p>
//               <p>Pack size</p>
//               <p>Price</p>
//               <p className="ml-auto">Actions</p>
//             </div>
//           </div>
//         </div>
//       )}
//       {items.map((m) => (
//         <div key={m.id} className="border-b last:border-b-0 px-4">
//           <div className="flex items-center gap-4">
//             <div>
//               <img
//                 src={m.thumbnail || ""}
//                 alt={m.title || ""}
//                 className="size-12 border rounded bg-card object-contain"
//               />
//             </div>
//             <Link className="flex-2" to="/product/$id" params={{ id: m.id }}>
//               <p className="font-medium break-words">{m.title}</p>
//               <p className="text-muted-foreground text-sm">
//                 {m.category.title}
//               </p>
//             </Link>
//             <div className="flex-3">
//               {m?.variants && m.variants.length > 0 && (
//                 <div
//                   className={cn(
//                     m?.variants?.length > 1 && "border-l",
//                     "divide-y"
//                   )}
//                 >
//                   {m.variants.map((v) => (
//                     <div
//                       key={v.id}
//                       className="grid grid-cols-5 items-center px-6 py-4 gap-6 justify-center"
//                     >
//                       <Badge
//                         variant={v?.active ? "success" : "neutral"}
//                         className="w-fit"
//                       >
//                         {v?.active ? "Active" : "Hidden"}
//                       </Badge>

//                       <p
//                         className={cn(
//                           v?.stock === 0 ? "text-destructive" : "",
//                           ""
//                         )}
//                       >
//                         {v?.stock === -1
//                           ? "Unlimited"
//                           : v?.stock === 0
//                             ? "Out of Stock"
//                             : v?.stock}
//                       </p>
//                       <p className="">{v?.unit}</p>
//                       <div>
//                         <p className="font-medium">
//                           {formatAmount("inr", v?.storePrice || 0)}
//                         </p>
//                         {v?.price && v?.price !== v?.storePrice && (
//                           <p className="text-muted-foreground text-sm line-through">
//                             {formatAmount("inr", v?.price || 0)}
//                           </p>
//                         )}
//                       </div>

//                       <div className="flex gap-2 ml-auto">
//                         <FormEditInventory
//                           type="update"
//                           data={m}
//                           variantId={v.id!}
//                         >
//                           <Button size="icon-sm">
//                             <Edit />
//                           </Button>
//                         </FormEditInventory>

//                         <FormDeleteInventory inventory={v}>
//                           <Button size="icon-sm" variant={"outline"}>
//                             <Trash />
//                           </Button>
//                         </FormDeleteInventory>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

export function AddOptions({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DrawerDialogSwitcher open={open} onOpenChange={setOpen} trigger={children}>
      <DrawerDialogHeader className="-mx-4 border-b px-4">
        <DrawerDialogTitle>Add menu items</DrawerDialogTitle>
      </DrawerDialogHeader>

      <div className="divide-y divide-dashed">
        <Link
          to="/product/add"
          className="flex items-center justify-between py-6"
          search={{ type: "product", product: undefined }}
        >
          <p className="text-lg">Add item</p>
          <ChevronRight />
        </Link>

        <Link
          to="/product/add"
          className="flex items-center justify-between py-6"
          search={{ type: "category", product: undefined }}
        >
          <p className="text-lg">Add category</p>
          <ChevronRight />
        </Link>
      </div>
    </DrawerDialogSwitcher>
  );
}
