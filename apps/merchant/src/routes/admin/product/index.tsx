import { formatAmount } from "@lipy/lib/utils/intl";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { SearchInput } from "@lipy/web-ui/components/forms/searchInput";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";

import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { PenLine, Tickets, Trash } from "lucide-react";
import { z } from "zod";
import FormDelete from "./-form-delete";
import FormEdit from "./-form.edit";
import { ProductProvider, useProduct } from "./-provider";
import ToggleProductActive from "./-toggle-active";

export const Route = createFileRoute("/admin/product/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    q: z.string().default(""),
    category: z.string().optional(),
  }),
});

// type Response = InferResponseType<typeof adminProductApi.$get>;

function RouteComponent() {
  const { q, page } = Route.useSearch();

  return (
    <ProductProvider query={{ q, page: String(page), limit: String(100) }}>
      <DashboardHeader title="Products" />
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
          <FormEdit type="create">
            <Button className="w-full">Add New</Button>
          </FormEdit>
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
    <div className="grid divide-y border rounded overflow-y-auto">
      {data.items.map((m) => (
        <div
          key={m.id}
          className="h-full grid grid-cols-[50px_1fr_fit-content(100px)_fit-content(100px)_200px_fit-content(150px)] gap-4 px-3 py-3 items-center"
        >
          {/* <TableCell className="truncate">{m.id}</TableCell> */}

          <div>
            <img
              src={m.thumbnail || ""}
              alt={m.title || ""}
              className="size-12 border rounded bg-accent"
            />
          </div>
          <div>
            <p className="font-medium block break-words">{m.title}</p>
            <p className="font-light block break-words">{m.summary}</p>
          </div>

          <div>
            <ToggleProductActive />
          </div>

          <div>
            <Button size="sm" variant="outline">
              <Tickets /> {m?.variants?.length || 0} Variants
            </Button>
          </div>

          <div className="pl-4">
            <p className="font-medium">
              {formatAmount("inr", m?.price || 0)}{" "}
              {m?.maxPrice && (
                <span className="text-muted-foreground text-xs line-through">
                  {formatAmount("inr", m?.maxPrice || 0)}
                </span>
              )}
            </p>
            {m?.maxPrice && (
              <p>
                <Badge size="small" variant="info">
                  {formatAmount("inr", m?.maxPrice - (m?.price || 0))} Off
                </Badge>
              </p>
            )}
          </div>
          <div>
            <div>
              <div className="flex gap-2">
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

                {/* <Link
									to="/admin/product/$id"
									params={{ id: m.id }}
									className={cn(
										buttonVariants({ size: "icon-sm", variant: "outline" }),
									)}
								>
									<ArrowUpRight />
								</Link> */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
