import type { publicShopApi } from "@lipy/lib/api";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { buttonVariants } from "@lipy/web-ui/components/ui/button";
import { getStoreStatus } from "@lipy/web-ui/lib/helper";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import type { InferResponseType } from "hono/client";
import {
  BrickWall,
  BriefcaseMedical,
  Cherry,
  Coffee,
  MapPin,
  Search,
  ShoppingBasket,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";

export const storeType = {
  pharmacy: {
    icon: BriefcaseMedical,
    label: "Pharmacy",
    color: "text-cyan-700",
  },
  grocery: {
    icon: ShoppingBasket,
    label: "Grocery",
    color: "text-amber-500",
  },
  fruits_and_vegetables: {
    icon: Cherry,
    label: "Fruits & Vegetables",
    color: "text-lime-500",
  },
  restaurant: {
    icon: Utensils,
    label: "Restaurant",
    color: "text-rose-500",
  },
  cafe: {
    icon: Coffee,
    label: "cafe",
    color: "text-amber-500",
  },
  hardware: {
    icon: BrickWall,
    label: "Hardware",
    color: "text-cyan-500",
  },
};

type SingleStore = InferResponseType<(typeof publicShopApi)[":handle"]["$get"]>;
export const StoreHeroSection = ({ storeInfo }: { storeInfo: SingleStore }) => {
  const typeInfo = storeType[storeInfo?.type as keyof typeof storeType];

  const { isOpen } = getStoreStatus(
    storeInfo.openingHour,
    storeInfo.closingHour,
    storeInfo.status
  );
  return (
    <div className="space-y-1 lg:divide-y">
      <div className="bg-card lg:bg-background p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div
              className={cn(
                typeInfo?.color || "",
                "inline-flex items-center font-medium gap-1"
              )}
            >
              {typeInfo?.icon && (
                <span>
                  <typeInfo.icon className="inline-block size-5" />
                </span>
              )}
              <p>{typeInfo?.label || ""}</p>
            </div>

            <h1 className="text-3xl font-bold pb-2">{storeInfo.name}</h1>

            <div className="inline-flex items-center gap-1">
              <MapPin className="size-4 flex-shrink-0 stroke-2" />
              {[storeInfo?.address?.line2, storeInfo?.address?.city]
                .filter(Boolean)
                .join(", ")}
            </div>
          </div>
        </div>

        {!isOpen && (
          <div className="bg-destructive/10 p-2 rounded-md">
            <Badge
              variant={"destructive"}
              appearance={"soft"}
              size={"xs"}
              className="p-0"
            >
              Closed Now
            </Badge>
            <div className="flex items-center gap-1 justify-between">
              <p className="">
                You can place order now, the order will be executed as soon as
                we are open.
              </p>
              <img
                src="/assets/icons/clock.svg"
                alt="clock"
                className="size-8"
              />
            </div>
          </div>
        )}
        {storeInfo?.coupons && storeInfo?.coupons.length > 0 && (
          <div className="border-t pt-2">
            <StoreCoupons coupons={storeInfo?.coupons} />
          </div>
        )}
      </div>
      {storeInfo?.type === "pharmacy" && (
        <PharmacyPrescriptionUpload storeInfo={storeInfo} />
      )}
      <div className="bg-card px-4 py-2">
        <Link
          className={cn(
            buttonVariants({ variant: "tertiary", size: "sm" }),
            "w-full justify-start text-muted-foreground bg-tertiary/50 border border-border/50"
          )}
          to="/$storeHandle/products/search"
          params={{ storeHandle: storeInfo?.handle || "" }}
        >
          <Search className="text-primary" />
          Search in {storeInfo?.name}
        </Link>
      </div>
    </div>
  );
};

function PharmacyPrescriptionUpload({ storeInfo }: { storeInfo: SingleStore }) {
  return (
    <div className="bg-card lg:bg-background flex gap-2 items-start justify-between p-4">
      <img
        src="/assets/prescription.svg"
        alt="prescription"
        className="size-16 object-cover bg-card flex-shrink-0"
      />
      <div className="flex flex-col items-end mr-auto">
        <p className="font-semibold mr-auto">Order with prescription</p>
        <p className="text-muted-foreground text-xs">
          and let us arrange your medicines
        </p>
      </div>
      <Link
        to="/$storeHandle/order/new"
        params={{ storeHandle: storeInfo?.handle || "" }}
        className={cn(
          buttonVariants({ size: "sm" }),
          "mx-auto m-0 ml-auto mt-auto"
        )}
      >
        Order now
      </Link>
    </div>
  );
}

function StoreCoupons({ coupons }: { coupons: SingleStore["coupons"] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((i) => (i + 1) % coupons.length),
      6000
    );
    return () => clearInterval(timer);
  }, [coupons.length]);

  const coupon = coupons[current];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        // className="absolute inset-0 flex flex-col items-center justify-center space-y-4"
        className="flex items-center gap-2 "
      >
        <img
          src={
            coupon?.type === "free-delivery"
              ? "/assets/icons/scooter-delivery.svg"
              : "/assets/icons/discount.svg"
          }
          alt=""
          className="flex-shrink-0 size-5"
        />
        <h2 className="font-medium">{coupon.title}</h2>
      </motion.div>
    </AnimatePresence>
  );
}
