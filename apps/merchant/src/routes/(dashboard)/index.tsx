import { merchantDashboardApi } from "@lipy/lib/api";
import { useSoundPlayer } from "@lipy/lib/hooks/use-sound";
import { useStore } from "@lipy/lib/hooks/use-store";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { OrderChart } from "@lipy/web-ui/components/charts/orderChart";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@lipy/web-ui/components/ui/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Label } from "@lipy/web-ui/components/ui/label";
import { ScrollArea } from "@lipy/web-ui/components/ui/scroll-area";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import type { InferResponseType } from "hono";
import {
  Clock10,
  Shirt,
  ShoppingCart,
  SquareUser,
  Store,
  StoreIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

type Response = InferResponseType<typeof merchantDashboardApi.index.$get>;

export const Route = createFileRoute("/(dashboard)/")({
  component: RouteComponent,
});

const btns = [
  {
    name: "Store Settings",
    icon: StoreIcon,
    className: "bg-yellow-400 text-background",
    href: "/store",
  },
  {
    name: "Express Checkout",
    icon: ShoppingCart,
    className: "bg-emerald-600 text-foreground",
    href: "/pos/checkout",
  },
  {
    name: "My Customers",
    icon: SquareUser,
    className: "bg-amber-600 text-foreground",
    href: "/customer",
  },
  {
    name: "My Products",
    icon: Shirt,
    className: "bg-indigo-600 text-foreground",
    href: "/product",
  },
];
function RouteComponent() {
  const { data } = useStore();

  const itemRef = useRef<Response["pendingOrders"]>(undefined);
  const res = useAPIQuery(
    merchantDashboardApi.index,
    "$get",
    {},
    {
      refetchInterval: 20000,
    }
  );

  const { play } = useSoundPlayer();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress dependencies
  useEffect(() => {
    const prevItem = itemRef.current;
    itemRef.current = res.data?.pendingOrders;
    if (
      !res.isFetching &&
      prevItem &&
      prevItem.length !== itemRef.current?.length
    ) {
      play();
    }
  }, [res.isFetching]);

  return (
    <div className="grid lg:grid-cols-12  lg:p-8 gap-8">
      <div className="col-span-8  flex gap-4  flex-col md:sticky md:top-0">
        <Link to={"/store"} className="flex gap-4  items-center p-4 lg:p-0">
          <Avatar className="size-12 rounded bg-primary">
            <AvatarImage
              alt=""
              className="object-cover"
              src={data?.image || ""}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Store />
            </AvatarFallback>
          </Avatar>
          <div>
            <p>Welcome to,</p>
            <h1 className="text-2xl">{data?.name || "Store"}</h1>
          </div>
        </Link>

        {!data?.active && (
          <Alert variant={"info"}>
            <AlertTitle>Your store is under verification</AlertTitle>
            <AlertDescription>
              We are reviewing your store and will be live in sometime. In the
              mean time you can setup your inventory.
            </AlertDescription>
          </Alert>
        )}

        <Card className="">
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {btns.map((d, i) => (
              <Link
                key={i}
                className={cn(
                  "p-4 flex flex-col gap-2 items-center rounded justify-center text-center md:aspect-square cursor-pointer hover:opacity-85",
                  d.className
                )}
                to={d.href}
              >
                <div>
                  <d.icon className="size-8" />
                </div>
                <p className="text-sm lg:text-base">{d.name}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
        <OrderChart data={res.data?.counts} isLoading={res.isLoading} />
        <div className="lg:hidden">
          <Orders data={res.data?.pendingOrders} isLoading={res.isLoading} />
        </div>
      </div>

      <div className="col-span-4 hidden lg:flex flex-col">
        <Orders data={res.data?.pendingOrders} isLoading={res.isLoading} />
      </div>
    </div>
  );
}

function Orders({
  data,
  isLoading,
}: {
  data:
    | InferResponseType<typeof merchantDashboardApi.index.$get>["pendingOrders"]
    | undefined;
  isLoading: boolean;
}) {
  return (
    <Card className="flex-1">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Pending Orders</CardTitle>
        <Link
          className={cn(buttonVariants({ variant: "underline" }), "p-0")}
          to="/pos/order"
          search={(p) => ({ ...p, page: 1 })}
        >
          All orders
        </Link>
      </CardHeader>

      <CardContent className="divide-y">
        {isLoading ? (
          <Skeleton className="flex-1 h-screen" />
        ) : !data || data?.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center items-center text-center m-auto text-muted-foreground">
            <Clock10 className="size-16 mb-2" />
            <Label className="text-lg">No Incoming Orders.</Label>
          </div>
        ) : (
          <ScrollArea className="h-[calc(80vh)]">
            {data.map((v, i) => {
              return (
                <Link
                  to={"/pos/order/$id"}
                  params={{ id: v.id }}
                  key={i}
                  className="leading-none flex py-4 space-y-2 hover:bg-accent/40"
                >
                  <div className="flex gap-4 flex-1 justify-between text-base lg:text-sm">
                    <div className="flex-1 flex gap-2">
                      <div
                        className={cn(
                          "border size-12 text-[7px] break-words text-center text-balance flex flex-col items-center justify-center",

                          v.status === "created" &&
                            "text-foreground bg-red-800",
                          v.status === "accepted" &&
                            "text-foreground bg-blue-700",
                          ["packed", "awaiting_customer_confirmation"].includes(
                            v.status || ""
                          ) && "text-foreground bg-amber-400",
                          v.status === "out_for_delivery" &&
                            "text-foreground bg-green-700"
                        )}
                      >
                        <span className="uppercase">
                          {v.status?.replaceAll("_", " ")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-medium truncate leading-none md:leading-normal">
                          #{v.id}
                        </p>
                        <p className="font-light break-words">
                          <span className="text-sm">
                            {v.customerDetails?.name}
                          </span>
                          <span className="text-xs text-muted-foreground w-full block md:w-fit md:inline-flex">
                            &nbsp;on {format(v.orderedAt, "Pp")}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="w-fit text-right">
                      <p className="font-semibold">
                        {formatAmount("inr", v.totalAmount || 0)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
