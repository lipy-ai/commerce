import { useCartStore } from "@/components/cart/store";
import PlaceOrder from "@/components/order/placeOrder";
import { publicShopApi } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { DetailedAddress } from "@lipy/web-ui/components/maps/detailedAddress";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import EmptyPage from "@lipy/web-ui/components/pages/empty";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@lipy/web-ui/components/ui/card";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  MapPinned,
  Package2,
  PhoneCall,
  Store,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute(
  "/(default)/(store)/$storeHandle/order/(pharmacy)/checkout"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { deliveryLocation } = useLocationStore();
  const [detailedAddressDrawerOpen, setDetailedAddressDrawerOpen] =
    useState(false);
  const { storeHandle } = Route.useParams();
  const { uploadedImages } = useCartStore();

  const { data: storeInfo } = useAPIQuery(publicShopApi[":handle"], "$get", {
    param: { handle: storeHandle },
  });
  return (
    <>
      <DashboardHeader title="Place order" />
      {uploadedImages && uploadedImages.length > 0 ? (
        <div>
          <div className=" space-y-2 my-4">
            <Card className="rounded-none">
              <CardHeader className="flex items-center justify-between mb-2 border-b -mx-4 border-dashed">
                <Link
                  className="flex items-center gap-2 px-4"
                  to="/$storeHandle"
                  params={{ storeHandle }}
                >
                  <Avatar className="rounded-md size-10">
                    <AvatarImage src={storeInfo?.image || ""} />
                    <AvatarFallback>
                      <Store />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-base font-semibold">{storeInfo?.name}</p>
                    <p className="text-muted-foreground text-xs line-clamp-1">
                      {[
                        storeInfo?.address?.line1,
                        storeInfo?.address?.line2,
                        storeInfo?.address?.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </Link>
              </CardHeader>

              <CardContent>
                <Label>Your uploaded prescriptions</Label>

                <div
                  className=" flex gap-4 overflow-x-auto scrollbar-hide -mx-4 p-4"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  {uploadedImages.map((file, index) => {
                    const objectUrl = URL.createObjectURL(file);

                    return (
                      <img
                        key={index}
                        src={objectUrl}
                        alt={`Prescription ${index + 1}`}
                        className="object-cover w-32 h-44 border rounded-xl"
                        onLoad={() => URL.revokeObjectURL(objectUrl)}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className=" px-4 py-2 flex items-center gap-2 justify-between ">
              <p className="text-muted-foreground">
                We may call you to confirm your medicines, delivery details in
                case of any confusion.
              </p>
              <PhoneCall className="fill-secondary/40 size-6 flex-shrink-0" />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 lg:left-auto right-0 border-t w-full bg-card shadow-xl border-2 rounded-t-xl p-2 lg:w-[500px]">
            <div
              className="rounded-t-xl  cursor-pointer border-b border-dashed pb-2"
              onClick={() => setDetailedAddressDrawerOpen(true)}
            >
              <div className="flex items-center gap-2">
                <Avatar className="rounded-md">
                  <AvatarFallback>
                    <MapPinned className="size-6 fill-secondary/40" />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      Delivering to {deliveryLocation?.tag}
                    </p>
                    <ChevronDown className="size-5" />
                  </div>
                  <p className="line-clamp-1 text-xs">
                    {[
                      deliveryLocation?.name,
                      deliveryLocation?.metadata?.building,
                      deliveryLocation?.line1,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <PlaceOrder
              setOpen={setDetailedAddressDrawerOpen}
              storeId={storeInfo?.id}
              customOrder
            />
          </div>
        </div>
      ) : (
        <EmptyPage
          title="No prescriptions uploaded"
          label="Upload prescriptions to place an order"
          icon={Package2}
        />
      )}

      {detailedAddressDrawerOpen && (
        <DetailedAddress
          fullAddress={deliveryLocation}
          open={detailedAddressDrawerOpen}
          onOpenChange={setDetailedAddressDrawerOpen}
          label={"Edit"}
          isDeliveryAddress
        />
      )}
    </>
  );
}
