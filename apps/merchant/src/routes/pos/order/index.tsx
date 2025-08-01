import { posOrderApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { OrderStatus } from "@lipy/web-ui/components/custom-ui/orderStatus";
import SearchBar from "@lipy/web-ui/components/custom-ui/searchBar";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Pagination } from "@lipy/web-ui/components/pages/pagination";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@lipy/web-ui/components/ui/table";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
// import { formatDistanceToNow } from "date-fns";
import type { InferResponseType } from "hono/client";
import { ArrowUpRight } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/pos/order/")({
  component: RouteComponent,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    q: z.string().default(""),
  }),
});

type Response = InferResponseType<typeof posOrderApi.index.$get>;

function RouteComponent() {
  const { isMobile } = useViewport();
  const { page, q } = Route.useSearch();

  const { data, isLoading } = useAPIQuery(
    posOrderApi.index,
    "$get",
    {
      query: { page: String(page), limit: String(10), q },
    },
    { placeholderData: (p) => p }
  );

  return (
    <>
      <DashboardHeader title="Orders" />

      <div className="lg:p-8 lg:space-y-8 flex flex-col flex-1">
        <div className="p-4 lg:p-0">
          <SearchBar placeholder="Search orders" defaultValue={q} />
        </div>
        {isLoading ? (
          <Skeleton className="flex-1 mx-4 lg:mx-0" />
        ) : !data || data.items.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex flex-1 justify-center flex-col items-center m-auto min-h-[60vh]  text-center">
              <img
                src={
                  q ? "/assets/no-results-found.png" : "/assets/no-order.png"
                }
                alt="no-order"
                className="size-40 lg:size-48 object-cover"
              />
              {q ? (
                <h1 className="text-lg lg:text-xl font-medium pt-2">
                  No results found
                </h1>
              ) : (
                <div>
                  <h1 className="text-lg lg:text-xl font-medium">
                    Orders will appear here
                  </h1>
                  <p className="text-muted-foreground lg:text-base max-w-[450px] pb-4">
                    View and manage your orders or create manual order through
                    express checkout
                  </p>
                  <Link
                    to="/pos/checkout"
                    className={cn(
                      buttonVariants({ size: isMobile ? "sm" : "default" })
                    )}
                  >
                    Create manual order
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

export function MobileView({ items }: { items: Response["items"] }) {
  return (
    <div className="divide-y border-y bg-card">
      {items.map((m) => (
        <Link
          key={m.id}
          to="/pos/order/$id"
          params={{ id: m.id }}
          className="flex items-start justify-between p-4 "
        >
          <div className="flex flex-col gap-1">
            <div className="text-xs text-muted-foreground font-medium">
              Order #{m.id}
            </div>

            <div className="text-sm font-medium line-clamp-1">
              {m?.customerDetails?.name || m?.customerDetails?.email || ""}
            </div>

            <div className="text-xs text-muted-foreground">
              {m?.customerDetails?.phone || ""}
            </div>
          </div>

          <div className="text-right flex flex-col gap-1 items-end">
            <OrderStatus status={m.status || "created"} />
            <div className="text-lg font-semibold">
              {formatAmount("inr", Number(m.itemTotalAmount))}
            </div>
            <div className="text-xs text-muted-foreground">
              {m.orderedAt && `${formatDistanceToNow(m.orderedAt)} ago`}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function DesktopView({ items }: { items: Response["items"] }) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">#</TableHead>
          {/* <TableHead className="">Customer</TableHead>
					<TableHead className="">Delivery Partner</TableHead>{" "} */}
          <TableHead className="w-32">Ordered</TableHead>
          <TableHead className="w-32">Customer</TableHead>

          <TableHead className="w-32">Status</TableHead>
          <TableHead className="w-32">Items</TableHead>
          <TableHead className="w-24">Total</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((m) => (
          <TableRow
            key={m.id}
            onClick={() =>
              navigate({ to: "/pos/order/$id", params: { id: m.id } })
            }
            className="cursor-pointer focus:bg-accent"
          >
            <TableCell>{m.id}</TableCell>

            <TableCell>
              {m.orderedAt && ` ${formatDistanceToNow(m.orderedAt)} ago`}
            </TableCell>

            <TableCell>
              {m?.customerDetails?.name ||
                m?.customerDetails?.email ||
                m?.customerDetails?.phone}
            </TableCell>
            <TableCell>
              <OrderStatus status={m.status || "created"} size={"sm"} />
            </TableCell>
            <TableCell>
              {m?.items?.length === 0
                ? "Custom order"
                : m?.items?.length === 1
                  ? "1 item"
                  : `${m?.items?.length} items`}{" "}
            </TableCell>
            <TableCell>{formatAmount("inr", m.totalAmount || 0)}</TableCell>
            <TableCell>
              <Link
                to="/"
                className={cn(
                  buttonVariants({ size: "icon", variant: "ghost" })
                )}
              >
                <ArrowUpRight />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
