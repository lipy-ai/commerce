import { merchantProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { SearchInput } from "@lipy/web-ui/components/forms/searchInput";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardHeader, CardTitle } from "@lipy/web-ui/components/ui/card";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { Edit, EllipsisVertical, Plus, Trash } from "lucide-react";
import { z } from "zod";
import FormDeleteInventory from "./-form-delete-inventory";
import FormEditInventory from "./-form-edit-inventory";
import FormEdit from "./-form.edit";

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
        <FormEdit type="create">
          <Button size={"sm"}>
            <Plus />
            New Product
            {/* {isMobile ? "" : "New Product"} */}
          </Button>
        </FormEdit>
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
          <Card className="m-4 md:m-0">
            <CardHeader>
              <CardTitle>No Products Found...</CardTitle>
            </CardHeader>
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
    <div className="bg-background border divide-y">
      {items?.map((m) =>
        m.variants?.map((v) => (
          <div
            className={cn(
              !v.active && "bg-muted-foreground/10 opacity-80",
              "p-4"
            )}
            key={v.id}
          >
            <div className="flex w-full gap-4 justify-between text-base">
              <div className="flex  gap-2">
                <div className="flex-shrink-0">
                  <img
                    src={m.thumbnail || ""}
                    alt={m.title || ""}
                    className="size-16 border border-border/50 rounded-lg bg-accent object-cover shadow-sm"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base leading-5 mb-1 line-clamp-2 break-words">
                    {m.title}
                  </h3>

                  <p className="text-muted-foreground text-sm truncate mb-2">
                    {m.category}
                  </p>

                  <Badge variant={"subtle"} className="mr-4">
                    {v?.unit}
                  </Badge>
                  <Badge
                    variant={v?.stock === 0 ? "destructive" : "success"}
                    className="mr-4"
                  >
                    {v?.stock === -1
                      ? "Unlimited"
                      : v?.stock === 0
                        ? "Out of"
                        : "In"}{" "}
                    stock
                  </Badge>
                  {!v?.active && <Badge variant="accent">Hidden</Badge>}

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
                </div>
              </div>

              <FormEditInventory type="update" data={m} variantId={v.id!}>
                <Button size="icon-xs" variant="ghost">
                  <EllipsisVertical />
                </Button>
              </FormEditInventory>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function DesktopView({ items }: { items: Response["items"] }) {
  return (
    <div className="border rounded overflow-y-auto">
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
                        variant={v?.active ? "success" : "ghost"}
                        size="spacious"
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
