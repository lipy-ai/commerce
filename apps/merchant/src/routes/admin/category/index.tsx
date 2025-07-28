import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { PenLine, Plus, Trash } from "lucide-react";
import { z } from "zod";
import CategoryFormDelete from "./-form-delete";
import { CategoryFormEdit } from "./-form.edit";
import { CategoryProvider, useCategory } from "./-provider";

export const Route = createFileRoute("/admin/category/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    q: z.string().default(""),
  }),
});

function RouteComponent() {
  const { q, page } = Route.useSearch();

  return (
    <CategoryProvider query={{ q, page: String(page), limit: String(100) }}>
      <DashboardHeader title="Categories" />
      <Component />
    </CategoryProvider>
  );
}

function Component() {
  const { q } = Route.useSearch();
  const { data } = useCategory();

  return (
    <div className="px-4 py-8 md:p-8 space-y-8 flex-1 flex flex-col">
      <div className="flex flex-row items-center gap-2">
        <SearchBar
          placeholder="Search category"
          defaultValue={q}
          className="flex-1 w-full lg:w-auto p-0"
        />
        <CategoryFormEdit type="create">
          <Button>Add New</Button>
        </CategoryFormEdit>
      </div>
      <DesktopView />
      {data && <Pagination {...data} />}
    </div>
  );
}

export const DesktopView = () => {
  const { data, isLoading } = useCategory();

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
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto">
        {[...Array(50)].map((g) => (
          <div
            key={g}
            className="size-20 shrink-0 border flex flex-col justify-center items-center rounded bg-card text-center"
          >
            <div>
              <Plus />
            </div>
            <p className="text-xs">Category Name</p>
          </div>
        ))}
      </div>
      <div className="grid divide-y border rounded">
        {data?.items.map((m) => (
          <div
            key={m.id}
            className="h-full flex flex-row gap-4 px-3 py-3 items-center"
          >
            <div className="bg-card rounded size-12 border overflow-hidden">
              <img
                src={m.image || "/assets/placeholder-image.svg"}
                alt={m.title || ""}
              />
            </div>
            <div className="flex-1">
              <p>{m.title}</p>
              {m.summary && <p>{m.summary}</p>}
            </div>
            <div className="flex gap-2">
              <CategoryFormEdit type="update" data={m as any}>
                <Button className="" variant={"default"} size="icon-sm">
                  <PenLine />
                </Button>
              </CategoryFormEdit>
              <CategoryFormDelete id={m.id}>
                <Button className="" variant={"outline"} size="icon-sm">
                  <Trash />
                </Button>
              </CategoryFormDelete>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
