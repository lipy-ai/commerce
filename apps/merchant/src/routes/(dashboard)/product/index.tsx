import { merchantProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { SearchInput } from "@lipy/web-ui/components/forms/searchInput";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { Edit, Plus, Trash } from "lucide-react";
import { z } from "zod";
import FormDeleteInventory from "./-form-delete-inventory";
import FormEditInventory from "./-form-edit-inventory";

export const Route = createFileRoute("/(dashboard)/product/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    q: z.string().default(""),
    category: z.string().optional(),
  }),
});

type Response = InferResponseType<typeof merchantProductApi.index.$get>;

function RouteComponent() {
  const { isMobile } = useViewport();
  const { page, q, category } = Route.useSearch();
  const navigate = Route.useNavigate();

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

  return (
    <>
      <DashboardHeader title="Products">
        <Link className={cn(buttonVariants({ size: "sm" }))} to="/product/add">
          <Plus />
          New Product
        </Link>
      </DashboardHeader>

      <div className="lg:p-8 lg:space-y-8 flex flex-col flex-1">
        <div className="p-4 lg:p-0 flex flex-col lg:flex-row items-center gap-2">
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
                  No products found for "{q}"
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
                  <Link
                    to="/product/add"
                    className={cn(
                      buttonVariants({ size: isMobile ? "sm" : "default" })
                    )}
                  >
                    Browse and add products
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {isMobile ? (
              <MobileView items={data.items} />
            ) : (
              <DesktopView items={data.items} />
            )}
            <Pagination {...data} />
          </>
        )}
      </div>
    </>
  );
}

function MobileView({ items }: { items: Response["items"] }) {
  return (
    <div className="bg-card border-y divide-y divide-dashed">
      {items?.map((m) =>
        m.variants?.map((v) => (
          <div
            className={cn(v?.active ? "opacity-100" : "opacity-80", "p-4 py-6")}
            key={v.id}
          >
            <div className="flex items-start gap-4 justify-between">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        "size-1.5 rounded-full",
                        v?.active ? "bg-green-700" : "bg-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs",
                        v?.active ? "text-green-700" : "text-muted-foreground",
                        "font-medium"
                      )}
                    >
                      {v?.active ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground text-base line-clamp-2 break-words">
                      {m.title}
                    </h3>
                    <p className="text-muted-foreground text-xs truncate">
                      {m.category}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-base text-foreground">
                      {formatAmount("inr", v?.storePrice || 0)}
                    </span>
                    {v?.price && v?.price !== v?.storePrice && (
                      <span className="text-muted-foreground text-sm line-through">
                        {formatAmount("inr", v?.price || 0)}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{v?.unit}</p>
                </div>

                <div className="flex gap-4 ">
                  <FormEditInventory type="update" data={m} variantId={v.id!}>
                    <Button
                      size="icon"
                      className="rounded-full"
                      variant={"outline"}
                    >
                      <Edit />
                    </Button>
                  </FormEditInventory>

                  <FormDeleteInventory inventory={v}>
                    <Button
                      size="icon"
                      variant={"outline"}
                      className="rounded-full"
                    >
                      <Trash />
                    </Button>
                  </FormDeleteInventory>
                </div>
              </div>

              <div className="flex-shrink-0 space-y-1.5 text-center">
                <img
                  src={m.thumbnail || ""}
                  alt={m.title || ""}
                  className={cn(
                    v?.active ? "grayscale-0" : "grayscale-100",
                    "w-28 h-28 border border-border/50 rounded-xl bg-accent object-cover"
                  )}
                />
                <p
                  className={cn(
                    v?.stock === 0 ? "text-destructive" : "text-ring"
                  )}
                >
                  {v?.stock === -1
                    ? "Unlimited"
                    : v?.stock === 0
                      ? "Out of"
                      : "In"}{" "}
                  stock
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function DesktopView({ items }: { items: Response["items"] }) {
  return (
    <div className="border rounded-xl overflow-y-auto bg-card shadow-xs">
      {items.length > 0 && (
        <div className="border-b px-4 text-base font-medium py-2 bg-accent/30">
          <div className="flex px-4 gap-4">
            <p className="w-24" />
            <p className="flex-2">Products</p>
            <div className="flex-3 grid grid-cols-5  px-6 gap-6">
              <p>Status</p>
              <p>Stock</p>
              <p>Pack size</p>
              <p>Price</p>
              <p className="ml-auto">Actions</p>
            </div>
          </div>
        </div>
      )}
      {items.map((m) => (
        <div key={m.id} className="border-b last:border-b-0 px-4">
          <div className="flex items-center gap-4">
            <div>
              <img
                src={m.thumbnail || ""}
                alt={m.title || ""}
                className="size-12 border rounded bg-accent object-cover"
              />
            </div>
            <div className="flex-2">
              <p className="font-medium break-words">{m.title}</p>
              <p className="text-muted-foreground text-sm">{m.category}</p>
            </div>
            <div className="flex-3">
              {m?.variants && m.variants.length > 0 && (
                <div
                  className={cn(
                    m?.variants?.length > 1 && "border-l",
                    "divide-y"
                  )}
                >
                  {m.variants.map((v) => (
                    <div
                      key={v.id}
                      className="grid grid-cols-5 items-center px-6 py-4 gap-6 justify-center"
                    >
                      <Badge
                        variant={v?.active ? "success" : "neutral"}
                        className="w-fit"
                      >
                        {v?.active ? "Active" : "Hidden"}
                      </Badge>

                      <p
                        className={cn(
                          v?.stock === 0 ? "text-destructive" : "",
                          ""
                        )}
                      >
                        {v?.stock === -1
                          ? "Unlimited"
                          : v?.stock === 0
                            ? "Out of Stock"
                            : v?.stock}
                      </p>
                      <p className="">{v?.unit}</p>
                      <div>
                        <p className="font-medium">
                          {formatAmount("inr", v?.storePrice || 0)}
                        </p>
                        {v?.price && v?.price !== v?.storePrice && (
                          <p className="text-muted-foreground text-sm line-through">
                            {formatAmount("inr", v?.price || 0)}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 ml-auto">
                        <FormEditInventory
                          type="update"
                          data={m}
                          variantId={v.id!}
                        >
                          <Button size="icon-sm">
                            <Edit />
                          </Button>
                        </FormEditInventory>

                        <FormDeleteInventory inventory={v}>
                          <Button size="icon-sm" variant={"outline"}>
                            <Trash />
                          </Button>
                        </FormDeleteInventory>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
// function DesktopView({ items }: { items: Response["items"] }) {
//   const navigate = useNavigate();

//   return (
//     <Table className="bg-background border p-8">
//       <TableHeader>
//         <TableRow>

//           <TableHead className="">Product</TableHead>

//           <TableHead className="w-32">Status</TableHead>
//           <TableHead className="w-32">Stock</TableHead>
//           <TableHead className="w-24">Amount</TableHead>

//           <TableHead className="w-10" />
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {items.map((m) => (
//           <TableRow
//             key={m.id}
//             onClick={() =>
//               navigate({ to: "/product/$id", params: { id: m.id } })
//             }
//             className="cursor-pointer focus:bg-accent"
//           >

//             <TableCell>
//               <div className="grid grid-cols-[50px_auto] gap-2">
//                 <img
//                   src={m.thumbnail || ""}
//                   alt={m.title || ""}
//                   className="size-12 border rounded bg-accent"
//                 />
//                 <div className="block break-words">
//                   <p className="font-medium">{m.title}</p>
//                   <p className="font-light">{m.summary}</p>
//                 </div>
//               </div>
//             </TableCell>

//             <TableCell>
//               <p>Active</p>
//             </TableCell>
//             <TableCell>
//               <Badge className="" variant={"success"}>
//                 In Stock
//               </Badge>
//             </TableCell>
//             <TableCell> {formatAmount("inr", m?.price || 0)}</TableCell>
//             <TableCell>
//               <Link
//                 to="/"
//                 className={cn(
//                   buttonVariants({ size: "icon", variant: "ghost" })
//                 )}
//               >
//                 <ArrowUpRight />
//               </Link>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }
