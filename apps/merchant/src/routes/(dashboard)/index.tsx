import { merchantDashboardApi } from "@lipy/lib/api";
import { useStore } from "@lipy/lib/hooks/use-store";
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
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Clock10, StoreIcon } from "lucide-react";
import { Shirt, ShoppingCart, SquareUser, Store } from "lucide-react";

import { OrderChart } from "@lipy/web-ui/components/charts/orderChart";
import { Label } from "@lipy/web-ui/components/ui/label";
import type { InferResponseType } from "hono";

// const setupSteps = [
//   {
//     name: "shopDetailsComplete",
//     completed: true,
//     title: "Fill necessary information about your shop",
//     description: "These information will help you run your shop smoothly.",
//     action: (
//       <Link
//         className={cn(
//           buttonVariants({ variant: "link" }),
//           "h-fit p-0 underline"
//         )}
//         to="/store"
//       >
//         Complete store details
//       </Link>
//     ),
//   },
//   {
//     name: "productAdded",
//     completed: false,
//     title: "List products at your shop",
//     description: "Add products in your shop.",
//     action: (
//       <Link className={cn(buttonVariants())} to="/product/add">
//         Add products
//       </Link>
//     ),
//   },
//   {
//     name: "productAdded",
//     completed: false,
//     title: "List products at your shop",
//     description: "Add products in your shop.",
//     action: (
//       <Link className={cn(buttonVariants())} to="/product/add">
//         Add products
//       </Link>
//     ),
//   },
// ];

export const Route = createFileRoute("/(dashboard)/")({
  component: RouteComponent,
});

const btns = [
  {
    name: "Store Settings",
    icon: StoreIcon,
    className: "bg-yellow-400 text-foreground",
    href: "/store",
  },
  {
    name: "Express Checkout",
    icon: ShoppingCart,
    className: "bg-emerald-600 text-primary-foreground",
    href: "/pos/checkout",
  },
  {
    name: "My Customers",
    icon: SquareUser,
    className: "bg-amber-600 text-primary-foreground",
    href: "/customer",
  },
  {
    name: "My Products",
    icon: Shirt,
    className: "bg-indigo-600 text-primary-foreground",
    href: "/product",
  },
];
function RouteComponent() {
  const { data } = useStore();

  const res = useAPIQuery(merchantDashboardApi.index, "$get", {});

  return (
    <div className="h-full">
      <div className="grid lg:grid-cols-12 md:divide-x">
        <div className="col-span-8 px-4 pb-4 flex gap-4 md:h-screen flex-col md:sticky md:top-0">
          <div className="flex gap-4 px-4 py-4 items-center border-b">
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
          </div>
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

        <div className="col-span-4 hidden lg:flex flex-col p-4">
          <Orders data={res.data?.pendingOrders} isLoading={res.isLoading} />
        </div>
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
  if (isLoading) {
    return <Skeleton className="flex-1" />;
  }

  if (!data || data.length === 0) {
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
          {data.map((v, i) => {
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
