// @ts-nocheck

import { formatAmount } from "@lipy/lib/utils/intl";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";

import { SearchInput } from "@lipy/web-ui/components/forms/searchInput";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Globe, PenLine, Tickets, Trash } from "lucide-react";
import { z } from "zod";
import FormDelete from "./-form-delete";
import FormEdit from "./-form.edit";
import { ProductProvider, useProduct } from "./-provider";

export const Route = createFileRoute("/admin/review-products/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    q: z.string().default(""),
    cat: z.string().optional(),
    subCat: z.string().optional(),
    store: z.string().optional(),
  }),
});

// type Response = InferResponseType<typeof adminProductApi.$get>;

function RouteComponent() {
  const { q, page, cat, subCat, store } = Route.useSearch();

  return (
    <ProductProvider
      query={{ q, page: String(page), limit: String(100), cat, subCat }}
    >
      <DashboardHeader title="Review Products" />
      <Component />
    </ProductProvider>
  );
}

function Component() {
  const { q, shop } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data, isLoading } = useProduct();

  return (
    <div className="px-4 pt-8 md:px-8 space-y-8 flex-1 flex flex-col overflow-x-auto">
      <div className="grid grid-cols-12 items-center gap-2">
        <SearchInput
          placeholder={"Select Shop"}
          type={"stores"}
          value={shop}
          onChange={(v) => navigate({ search: (p) => ({ ...p, shop: v }) })}
          className="col-span-2"
        />
        <SearchBar
          placeholder="Search products"
          defaultValue={q}
          className="flex-1 w-full lg:w-auto p-0 col-span-9 "
        />
        <div className="col-span-1">
          <FormEdit type="create">
            <Button className="w-full">Add New</Button>
          </FormEdit>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="size-full" />
      ) : (
        <div className="grid grid-cols-[250px_auto] gap-4">
          <div className="h-fit">
            <Label>Sub Categories</Label>
            <br />
            <ul className="divide-y py-4">
              <li>
                <Link
                  search={(s) => ({ ...s, subCat: "" })}
                  className="text-xs py-2 block hover:bg-accent"
                >
                  All (
                  {data?.subcategories?.reduce(
                    (a, c) => a + Number(c.total_count),
                    0
                  )}
                  )
                </Link>
              </li>
              {data?.subcategories.map((m) => (
                <li key={m.name}>
                  <Link
                    search={(s) => ({ ...s, subCat: m.name })}
                    key={m.name}
                    className="text-xs py-2 block hover:bg-accent"
                  >
                    {m.name || "Un-categorized"} ({m.total_count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8 ">
            <DesktopView />
            {data && <Pagination {...data} />}
          </div>
        </div>
      )}
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
    <div className="grid divide-y border rounded overflow-y-auto">
      {data.items.map((m) => (
        <div
          key={m.id}
          className="h-full grid grid-cols-[50px_1fr_fit-content(150px)] gap-4 px-3 py-3 items-center"
        >
          {/* <TableCell className="truncate">{m.id}</TableCell> */}

          <div>
            <img
              src={m.thumbnail || ""}
              alt={m.title || ""}
              className="size-12 border rounded bg-white object-contain"
            />
          </div>
          <div>
            <p className="font-medium block break-words">{m.title}</p>
            <div className="flex gap-2">
              {m.primaryCategory && (
                <Badge size={"sm"} className="inline-flex w-fit">
                  {m.primaryCategory}
                </Badge>
              )}
              <Badge size={"sm"} className="w-fit">
                {m.subCategory}
              </Badge>
              <Badge size={"sm"}>{m.metadata?.table}</Badge>

              <Badge size={"sm"}>#{m.metadata?.ref_id}</Badge>
            </div>
          </div>

          <div>
            <div>
              <div className="flex gap-2">
                {!m.productId ? (
                  <>
                    <FormEdit type="update" data={m}>
                      <Button size={"icon-sm"}>
                        <PenLine />
                      </Button>
                    </FormEdit>

                    <FormDelete id={m.id}>
                      <Button size={"icon-sm"} variant="outline">
                        <Trash />
                      </Button>
                    </FormDelete>
                  </>
                ) : (
                  <Button size={"sm"} variant="outline">
                    <Globe /> Published
                  </Button>
                )}

                <Link
                  to="/admin/product/$id"
                  params={{ id: m.productId }}
                  className={cn(
                    buttonVariants({ size: "icon-sm", variant: "outline" })
                  )}
                >
                  <ArrowUpRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
