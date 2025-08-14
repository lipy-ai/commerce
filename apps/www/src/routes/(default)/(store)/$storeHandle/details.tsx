import { env } from "@envClient";
import { usePublicStore } from "@lipy/lib/hooks/use-store";
import { GoogleMapsIcon } from "@lipy/web-ui/components/icons";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import Loading from "@lipy/web-ui/components/ui/loading";
import { shareContent } from "@lipy/web-ui/lib/share";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Bike, Clock, Handshake, Mail, Phone, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PrimaryCartFooter } from "@/components/cart/cartFooter";
import { getStoreStatus } from "./-helper";

type StoreStatus = {
  open: boolean;
  openTime: string;
  closeTime: string;
};

export const Route = createFileRoute("/(default)/(store)/$storeHandle/details")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { storeHandle } = Route.useParams();
  const [storeStatus, setStoreStatus] = useState<StoreStatus | null>(null);

  const res = usePublicStore({ handle: storeHandle });
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (res.data) {
      const { isOpen, openTime, closeTime } = getStoreStatus(
        res.data.openingHour,
        res.data.closingHour
      );
      setStoreStatus({ open: isOpen, openTime, closeTime });
    }
  }, [res.isLoading, res.data]);

  return (
    <>
      {res.isLoading ? (
        <Loading />
      ) : !res.data ? (
        <EmptyPage
          title="Shop not found"
          label="The shop you are looking for does not exist."
        />
      ) : (
        <div className="max-w-screen-lg mx-auto mb-20 w-full">
          <DashboardHeader>
            <Button
              variant={"ghost"}
              onClick={() => {
                shareContent({
                  title: res.data?.name as string,
                  text: "Hey, Check out this shop!",
                  url: `${env.WEB_URL}/${res.data?.handle}`,
                });
              }}
            >
              <Share2 className="stroke-2" />
            </Button>
          </DashboardHeader>
          <div className="relative w-full aspect-[16/9]">
            <img
              src={res.data?.image || "/logo/logo.png"}
              alt={res.data?.name}
              className="absolute inset-0 w-full h-full object-cover bg-accent/30"
              loading="lazy"
            />
          </div>
          <div className="bg-card my-4 p-4 space-y-2">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold ">{res.data?.name}</h1>
              <p className="text-muted-foreground text-sm capitalize">
                {res.data?.type}
              </p>
            </div>
            <p>
              {[
                res.data?.address?.line1,
                res.data?.address?.line2,
                res.data?.address?.city,
                res.data?.address?.state,
                res.data?.address?.postalCode,
                res.data?.address?.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>

            <p className="text-sm font-normal">{res.data?.description}</p>
            <div className="mt-4 flex items-center gap-4 justify-between">
              <div className="flex gap-4">
                <a
                  href={`mailto:${res.data?.email}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  <Mail />
                </a>
                <a
                  href={`tel:${res.data?.phone}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  <Phone />
                </a>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${res.data?.address?.lat},${res.data?.address?.lng}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "flex items-center gap-2"
                )}
              >
                <GoogleMapsIcon className="size-4" />
                Directions
              </a>
            </div>
          </div>

          <div className="bg-card p-4 divide-y divide-dashed mb-10">
            <div className="flex items-start justify-between py-4">
              <div className="flex items-start gap-2.5">
                <Clock className="flex-shrink-0 size-4 mt-1" />
                <div>
                  <p>Opening Hours</p>
                  <p className="text-muted-foreground">
                    {storeStatus?.openTime} - {storeStatus?.closeTime}
                  </p>
                </div>
              </div>

              {storeStatus?.open ? (
                <Badge variant="success">Open Now</Badge>
              ) : (
                <Badge variant="neutral">Closed Now</Badge>
              )}
            </div>
            {res.data?.freeDeliveryDistance > 0 && (
              <div className="flex items-center  gap-2.5 py-4">
                <Bike className="flex-shrink-0 size-4" />
                <p>Free delivery within {res.data?.freeDeliveryDistance} kms</p>
              </div>
            )}
            <div className="flex gap-2.5 py-4 items-center">
              <Handshake className="flex-shrink-0 size-4" />
              Partnered with Lipy since {format(res.data?.createdAt, "LLL yyy")}
            </div>
          </div>
          <div className="lg:hidden">
            <PrimaryCartFooter />
          </div>
        </div>
      )}
    </>
  );
}
