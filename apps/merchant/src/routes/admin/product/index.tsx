import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { SearchInput } from "@lipy/web-ui/components/forms/searchInput";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";

import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@lipy/web-ui/components/ui/table";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useSearch } from "@tanstack/react-router";
import { PenLine, Store, Tickets, Trash } from "lucide-react";
import { z } from "zod";
import FormDelete from "./-form-delete";
import FormEdit from "./-form.edit";
import { ProductProvider, useProduct } from "./-provider";
import AssignProductVariationForm from "./-variation";

export const Route = createFileRoute("/admin/product/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    q: z.string().default(""),
    category: z.string().optional(),
    shop: z.string().uuid().optional(),
    product: z.string().uuid().optional(),
    view: z.enum(["edit", "assign", "delete", "create"]).optional(),
  }),
});

// type Response = InferResponseType<typeof adminProductApi.$get>;

function RouteComponent() {
  const { q, page } = Route.useSearch();
  const { shop } = useSearch({ from: "/admin/product/" });
  const navigate = Route.useNavigate();

  return (
    <ProductProvider query={{ q, page: String(page), limit: String(100) }}>
      <DashboardHeader title="Products">
        <div className="flex items-center gap-4">
          <Store />
          <SearchInput
            name="store-select"
            type="stores"
            placeholder="Select Store"
            value={shop || ""}
            onChange={(v) =>
              navigate({ search: (s: any) => ({ ...s, shop: v }) } as any)
            }
            className="w-fit"
          />
        </div>
      </DashboardHeader>
      <Component />
    </ProductProvider>
  );
}

function Component() {
  const { q, category } = Route.useSearch();

  const navigate = Route.useNavigate();
  const { data } = useProduct();

  return (
    <div className="px-4 py-8 md:p-8 space-y-8 flex-1 flex flex-col">
      <FormEdit />
      <FormDelete />
      <AssignProductVariationForm />

      <div className="grid grid-cols-12 items-center gap-2">
        <SearchInput
          type="categories"
          value={category || ""}
          showAll
          onChange={(v) =>
            navigate({
              search: (p) => ({ ...p, page: 1, category: v || "" }),
            })
          }
          placeholder={"Select Category"}
          name={"Category"}
          className="col-span-12 md:col-span-2 order-3 md:order-none"
        />

        <SearchBar
          placeholder="Search products"
          defaultValue={q}
          className="flex-1 w-full lg:w-auto p-0 col-span-9"
        />
        <div className="col-span-3 md:col-span-1">
          <Link
            to={"/admin/product"}
            search={(s) => ({ ...s, view: "create" })}
            className={cn(buttonVariants(), "w-full")}
          >
            Add New
          </Link>
        </div>
      </div>
      <DesktopView />
      {data && <Pagination {...data} />}
    </div>
  );
}

function DesktopView() {
  const { data, isLoading } = useProduct();

  if (isLoading) {
    return <Skeleton className="flex-1" />;
  }
  if (!data || data?.items?.length === 0) {
    return (
      <div>
        <p>No Results found!</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Variants</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.items.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="flex items-center gap-4">
              <img
                src={m.thumbnail || ""}
                alt={m.title || ""}
                className="size-12 border rounded bg-accent"
              />
              <p className="font-medium block break-words">{m.title}</p>
            </TableCell>
            <TableCell>{m?.category?.title}</TableCell>
            <TableCell>
              <Link
                to={"/admin/product"}
                search={(s) => ({ ...s, view: "assign", product: m.id })}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                <Tickets /> Assign Variants
              </Link>
            </TableCell>
            <TableCell className="space-x-2">
              <Link
                to={"/admin/product"}
                search={(s) => ({ ...s, view: "edit", product: m.id })}
                className={cn(buttonVariants({ size: "icon-sm" }))}
              >
                <PenLine />
              </Link>
              <Link
                to={"/admin/product"}
                search={(s) => ({ ...s, view: "delete", product: m.id })}
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon-sm" })
                )}
              >
                <Trash />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // return (
  //   <div className="grid divide-y border rounded overflow-y-auto">
  //     {data.items.map((m) => (
  //       <div
  //         key={m.id}
  //         className="h-full grid grid-cols-[50px_1fr_fit-content(100px)_fit-content(100px)_200px_fit-content(150px)] gap-4 px-3 py-3 items-center"
  //       >
  //         <div>
  //           <img
  //             src={m.thumbnail || ""}
  //             alt={m.title || ""}
  //             className="size-12 border rounded bg-accent"
  //           />
  //         </div>
  //         <div className="min-w-xs">
  //           <p className="font-medium block break-words">{m.title}</p>
  //           <div className="flex gap-2">
  //             <Badge variant={"default"}>{m?.category?.title}</Badge>
  //             <Badge variant={"default"}>{m?.variants?.length} variants</Badge>
  //           </div>
  //         </div>

  //         <div>
  //           <ToggleProductActive />
  //         </div>

  //         <div>
  //           <Link
  //             to={"/admin/product"}
  //             search={(s) => ({ ...s, view: "assign", product: m.id })}
  //             className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
  //           >
  //             <Tickets /> Assign Variants
  //           </Link>
  //         </div>

  //         <div className="pl-4">
  //           <p className="font-medium">
  //             {formatAmount("inr", m?.variants?.[0]?.price || 0)}{" "}
  //             {m?.variants?.[0]?.maxPrice && (
  //               <span className="text-muted-foreground text-xs line-through">
  //                 {formatAmount("inr", m?.variants?.[0]?.maxPrice || 0)}
  //               </span>
  //             )}
  //           </p>
  //           {m?.variants?.[0]?.maxPrice && (
  //             <div>
  //               <Badge size="sm" variant="info">
  //                 {formatAmount(
  //                   "inr",
  //                   m?.variants?.[0]?.maxPrice - (m?.variants?.[0]?.price || 0)
  //                 )}{" "}
  //                 Off
  //               </Badge>
  //             </div>
  //           )}
  //         </div>
  //         <div>
  //           <div>
  //             <div className="flex gap-2">
  //               <Link
  //                 to={"/admin/product"}
  //                 search={(s) => ({ ...s, view: "edit", product: m.id })}
  //                 className={cn(buttonVariants({ size: "icon-sm" }))}
  //               >
  //                 <PenLine />
  //               </Link>
  //               <Link
  //                 to={"/admin/product"}
  //                 search={(s) => ({ ...s, view: "delete", product: m.id })}
  //                 className={cn(
  //                   buttonVariants({ variant: "outline", size: "icon-sm" })
  //                 )}
  //               >
  //                 <Trash />
  //               </Link>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );
}
