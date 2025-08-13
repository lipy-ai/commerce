import { merchantCouponApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import type { COUPON_TYPE } from "@lipy/server/db/schema";
import {
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { DrawerHeader } from "@lipy/web-ui/components/ui/drawer";
import { Label } from "@lipy/web-ui/components/ui/label";
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
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { BadgePercent, ChevronRight, Plus, Tag } from "lucide-react";
import { useState } from "react";
import { StoreNav } from "../-nav";

type Response = InferResponseType<typeof merchantCouponApi.index.$get>;
export const Route = createFileRoute("/(dashboard)/store/coupons/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useAPIQuery(merchantCouponApi.index, "$get", {});
  const { isMobile } = useViewport();
  console.log("Coupons data:", data);
  return (
    <>
      <DashboardHeader title="Coupons">
        {isMobile && (
          <CouponTypeOptions>
            <Button size="sm">
              <Plus />
              Create coupon
            </Button>
          </CouponTypeOptions>
        )}
      </DashboardHeader>
      <StoreNav>
        <div className="space-y-4">
          {!isMobile && (
            <div className="flex items-center justify-between">
              <Label className="text-lg">Coupons</Label>
              <CouponTypeOptions>
                <Button>
                  <Plus />
                  Create coupon
                </Button>
              </CouponTypeOptions>
            </div>
          )}

          {isLoading ? (
            <Skeleton className="h-96" />
          ) : !data || data.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-1 justify-center flex-col items-center m-auto min-h-[60vh]  text-center">
                <img
                  src="/assets/no-results-found.png"
                  alt="no-result-found"
                  className="size-40 lg:size-48 object-cover"
                />

                <div>
                  <h1 className="text-lg lg:text-xl font-medium">
                    Your coupons will appear here
                  </h1>
                  <p className="text-muted-foreground lg:text-base max-w-[450px] pb-4">
                    Create coupons to offer discounts to your customers.
                  </p>
                </div>
                <CouponTypeOptions>
                  <Button>
                    <Plus />
                    Create coupon
                  </Button>
                </CouponTypeOptions>
              </CardContent>
            </Card>
          ) : isMobile ? (
            <MobileView data={data} />
          ) : (
            <DesktopView data={data} />
          )}
        </div>
      </StoreNav>
    </>
  );
}

const MobileView = ({ data }: { data: Response }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-2 -mx-4">
      {data.map((coupon) => (
        <div
          key={coupon.id}
          className="border-border cursor-pointer bg-accent/40  p-4 flex items-center gap-4 "
          onClick={() => {
            navigate({
              to: "/store/coupons/new",
              search: () => ({
                couponId: coupon.id,
                type: coupon.type as (typeof COUPON_TYPE)[number],
              }),
            });
          }}
        >
          <div className="size-12 bg-blue-500 items-center justify-center flex">
            <Tag />
          </div>

          <div>
            <h2 className="font-medium text-lg">{coupon.title}</h2>
            <div className="flex items-center gap-2">
              <Badge
                variant={coupon.status === "active" ? "success" : "neutral"}
                appearance={"soft"}
                className="capitalize"
              >
                {coupon.status}
              </Badge>
              <p>{coupon.type}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
const DesktopView = ({ data }: { data: Response }) => {
  const navigate = useNavigate();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((coupon) => (
          <TableRow
            key={coupon.id}
            onClick={() => {
              navigate({
                to: "/store/coupons/new",
                search: () => ({
                  couponId: coupon.id,
                  type: coupon.type as (typeof COUPON_TYPE)[number],
                }),
              });
            }}
            className="cursor-pointer"
          >
            <TableCell>{coupon.title}</TableCell>
            <TableCell>
              <Badge
                variant={coupon.status === "active" ? "success" : "neutral"}
                appearance={"soft"}
                className="capitalize"
              >
                {coupon.status}
              </Badge>
            </TableCell>
            <TableCell>{coupon.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const CouponTypeOptions = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const couponOptions: {
    label: string;
    description: string;
    icon: any;
    couponType: (typeof COUPON_TYPE)[number];
  }[] = [
    // {
    //   label: "Free Delivery",
    //   description: "Offer free delivery on an order",
    //   icon: Bike,
    //   couponType: "free-delivery",
    // },
    {
      label: "Amount off",
      description: "Discount on total order amount",
      icon: BadgePercent,
      couponType: "amount-off",
    },
  ];
  return (
    <DrawerDialogSwitcher
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      className="sm:max-w-2xl"
    >
      <DrawerHeader>
        <DrawerDialogTitle>Select discount type</DrawerDialogTitle>
      </DrawerHeader>
      <div className="divide-y">
        {couponOptions.map((option, index) => (
          <Link
            key={index}
            className="flex items-center justify-between gap-4 hover:bg-accent/50 cursor-pointer -mx-6 px-6 py-4"
            to="/store/coupons/new"
            search={{
              type: option.couponType,
            }}
          >
            <div className="flex items-start gap-4 ">
              <option.icon className="size-6 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-base font-medium">{option.label}</h2>
                <p className="text-muted-foreground">{option?.description}</p>
              </div>
            </div>
            <ChevronRight className="flex-shrink-0 size-6" />
          </Link>
        ))}
      </div>
    </DrawerDialogSwitcher>
  );
};
