import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PenLine, Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { CategoryFormEdit } from "./-form.edit";
import CategoryFormDelete from "./-form-delete";
import { CategoryProvider, useCategory } from "./-provider";

export const Route = createFileRoute("/admin/category/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1).default(1),
    q: z.string().default(""),
    cat: z.string().default(""),
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

  return (
    <div className="m-8 space-y-8">
      <div className="flex items-center gap-2 w-full">
        <SearchBar
          placeholder="Search category"
          defaultValue={q}
          className="w-full p-0 "
        />
        <CategoryFormEdit type="create">
          <Button className="w-fit">Add New</Button>
        </CategoryFormEdit>
      </div>
      <DesktopView />
    </div>
  );
}

export const DesktopView = () => {
  const { data, isLoading } = useCategory();
  const { cat } = Route.useSearch();
  const navigate = Route.useNavigate();

  const currentParent = data?.items.find((f) => f.id === cat);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!currentParent && data) {
      navigate({ search: { cat: data.items[0].id } } as any);
    }
  }, [currentParent]);

  if (isLoading) {
    return <Skeleton className="flex-1" />;
  }
  //   if (!data || data?.items?.length === 0) {
  //     return (
  //       <div>
  //         <p>No Results found!</p>
  //       </div>
  //     );
  //   }

  return (
    <div className="space-y-4">
      <div
        className="flex overflow-x-auto gap-4"
        style={{ maxWidth: "calc(100vw - 130px)" }}
      >
        <CategoryFormEdit type="create">
          <div className="rounded space-y-2 text-center">
            <div className="bg-card rounded size-24 flex items-center justify-center overflow-hidden">
              <Plus className="size-10" />
            </div>
            <p className="text-xs">Add Category</p>
          </div>
        </CategoryFormEdit>
        {data?.items.map((m, i) => (
          <div className={cn("shrink-0 w-24 relative rounded")} key={i}>
            <div className="absolute right-1 top-1 z-100 text-foreground flex gap-1">
              <CategoryFormEdit type="update" data={m as any}>
                <Button variant={"outline"} size="icon-xs">
                  <PenLine />
                </Button>
              </CategoryFormEdit>
              <CategoryFormDelete id={m.id}>
                <Button variant={"outline"} size="icon-xs">
                  <Trash />
                </Button>
              </CategoryFormDelete>
            </div>
            <Link
              to="/admin/category"
              search={{ cat: m.id }}
              key={i}
              className={cn(
                "rounded space-y-2 pb-2 block overflow-hidden text-center"
              )}
            >
              <div
                className="bg-card aspect-square shrink-0 rounded overflow-hidden bg-contain bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${m.image || "/assets/placeholder-image.svg"})`,
                }}
              >
                <Badge
                  size={"xs"}
                  variant={"info"}
                  className="absolute right-1 bottom-1"
                >
                  {m.items.length}
                </Badge>
              </div>

              <p
                className={cn(
                  "text-xs py-2 rounded text-balance word-break",
                  cat === m.id && "text-primary-foreground bg-primary"
                )}
              >
                {m.title}
              </p>
            </Link>
          </div>
        ))}
      </div>
      <div className="grid divide-y border rounded">
        {!currentParent || currentParent?.items?.length === 0 ? (
          <p className="p-4">No Results Found...</p>
        ) : (
          currentParent?.items?.map((m, i) => (
            <div
              key={i}
              className="h-full flex flex-row gap-4 px-3 py-3 items-center"
            >
              <div
                className="bg-card rounded size-12 border overflow-hidden bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${m.image || "/assets/placeholder-image.svg"})`,
                }}
              />
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
          ))
        )}
      </div>
    </div>
  );
};
