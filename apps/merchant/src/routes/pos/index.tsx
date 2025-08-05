import { posOrderApi } from "@lipy/lib/api";
import { useAuthSession } from "@lipy/lib/hooks/use-auth";
import { usePublicStore } from "@lipy/lib/hooks/use-store";
import { formatAmount } from "@lipy/lib/utils/intl";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Clock10, Shirt, ShoppingCart, Store, StoreIcon } from "lucide-react";
export const Route = createFileRoute("/pos/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: sess } = useAuthSession();
  const { data: store } = usePublicStore({
    handle: sess?.session.activeStoreHandle || "",
  });

  const btns = [
    {
      name: "Orders",
      icon: StoreIcon,
      className: "bg-yellow-400 text-foreground",
      href: "/pos/order",
    },
    {
      name: "Express Checkout",
      icon: ShoppingCart,
      className: "bg-emerald-600 text-primary-foreground",
      href: "/pos/checkout",
    },
    {
      name: "My Account",
      icon: Shirt,
      className: "bg-indigo-600 text-primary-foreground",
      href: "/account",
    },
  ];

  const BTNS = (
    <Card className="">
      <CardContent className="grid grid-cols-9 gap-4">
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
  );

  return (
    <div className="h-full">
      <div className="md:divide-x">
        <div className="col-span-10 md:px-4 md:pb-4 flex gap-4 md:h-screen flex-col md:sticky md:top-0">
          <div className="flex gap-4 px-4 py-4 items-center border-b">
            <Avatar className="size-12 rounded bg-primary">
              <AvatarImage
                alt=""
                className="object-cover"
                src={store?.image || ""}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Store />
              </AvatarFallback>
            </Avatar>
            <div>
              <p>Welcome to,</p>
              <h1 className="text-2xl">{store?.name || "Store"}</h1>
            </div>
          </div>
          {BTNS}
          <Orders />
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const { data, isLoading } = useAPIQuery(posOrderApi.index, "$get", {
    query: { page: "1", limit: "100" },
  });

  if (isLoading) {
    return <Skeleton className="flex-1" />;
  }

  if (!data || data.items.length === 0) {
    return (
      <Card className="flex-1 py-8">
        <CardContent className="flex flex-1 justify-center flex-col gap-4 text-muted-foreground items-center">
          <Clock10 className="size-16" />
          <Label className="text-lg">No Incoming Orders.</Label>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Pending Orders</CardTitle>
      </CardHeader>
      {/* <DashboardHeader title="Recent Orders" hideBackBtn /> */}
      <CardContent className="">
        <div className="divide-y">
          {data.items.map((v, i) => {
            return (
              <Link
                to={"/pos/order/$id"}
                params={{ id: v.id }}
                key={i}
                className="leading-none flex py-3 space-y-2"
              >
                <div className="flex gap-4 flex-1 justify-between text-base lg:text-sm">
                  <div className="flex-1 flex gap-2">
                    <div
                      className={cn(
                        "border size-12 text-[7px] break-words text-center text-balance flex flex-col items-center justify-center",

                        v.status === "created" &&
                          "text-primary-foreground bg-red-800",
                        v.status === "accepted" &&
                          "text-primary-foreground bg-blue-700",
                        ["packed", "awaiting_customer_confirmation"].includes(
                          v.status || ""
                        ) && "text-foreground bg-amber-400",
                        v.status === "out_for_delivery" &&
                          "text-primary-foreground bg-green-700"
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
        </div>
      </CardContent>
    </Card>
  );
}
