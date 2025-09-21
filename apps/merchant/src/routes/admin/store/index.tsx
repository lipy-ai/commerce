import { adminStoreApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import Loading from "@lipy/web-ui/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@lipy/web-ui/components/ui/table";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import z from "zod";

export const Route = createFileRoute("/admin/store/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1).default(1),
    q: z.string().default(""),
  }),
});

function RouteComponent() {
  const { page, q } = Route.useSearch();
  const navigate = useNavigate();
  const { data, isLoading } = useAPIQuery(
    adminStoreApi.index,
    "$get",
    {
      query: { page: String(page), limit: String(20), q },
    },
    {
      placeholderData: (p) => p,
    }
  );

  if (isLoading) return <Loading />;

  console.log(data);

  return (
    <div>
      <DashboardHeader title="Stores">
        <Link
          className={cn(buttonVariants())}
          to="/admin/store/form"
          search={{ view: "create", store: undefined }}
        >
          {" "}
          <Plus /> Create new store
        </Link>
      </DashboardHeader>

      <div className="p-8 space-y-4">
        <SearchBar
          placeholder="Search the stores"
          defaultValue={q}
          className="flex-1 w-full lg:w-auto p-0"
        />
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.items.map((i) => (
              <TableRow
                key={i.id}
                className="cursor-pointer"
                onClick={() => {
                  navigate({
                    to: "/admin/store/form",
                    search: {
                      view: "update",
                      store: i.id,
                    },
                  });
                }}
              >
                <TableCell className="flex gap-4">
                  <img
                    src={i.image || "/assets/placeholder-image.svg"}
                    alt=""
                    className="size-16 rounded-lg"
                  />
                  <div>
                    <p className="text-base">{i.name}</p>
                    <p className="text-muted-foreground capitalize">{i.type}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination
          page={page}
          totalPages={data?.totalPages as number}
          totalResults={data?.totalResults as number}
        />
      </div>
    </div>
  );
}
