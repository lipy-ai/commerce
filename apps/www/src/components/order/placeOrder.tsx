import { env } from "@envClient";
import {
  loggedInCartApi,
  loggedInUploadApi,
  loggedIOrderApi,
} from "@lipy/lib/api";
import { authClient } from "@lipy/lib/providers/auth";
import {
  apiQueryOptions,
  useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Dialog, DialogContent } from "@lipy/web-ui/components/ui/dialog";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { CircleCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ResponseCart } from "@/routes/(default)/cart";
import { useCartStore } from "../cart/store";

interface PlaceOrderProps {
  setOpen: (open: boolean) => void;
  customOrder?: boolean;
  storeId?: string;
  data?: ResponseCart;
}

export default function PlaceOrder({
  setOpen,
  customOrder = false,
  storeId,
  data,
}: PlaceOrderProps) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { data: session } = authClient.useSession();
  const { deliveryLocation } = useLocationStore();

  const validateOrder = () => {
    if (!session) {
      toast("You are not logged in", {
        description: "Please log in to place an order",
        action: (
          <Link to="/login" className={cn(buttonVariants({ size: "sm" }))}>
            Login
          </Link>
        ),
      });
      return;
    }

    if (!deliveryLocation?.metadata?.building) {
      toast("Please give delivery location details.");
      setOpen(true);
      return;
    }

    setOrderPlaced(true);
  };

  return (
    <div className="flex items-center gap-4 my-2 justify-between">
      <div className="flex-1 text-center">
        <p className="font-medium">Pay Cash/UPI</p>
        <p>(on delivery)</p>
      </div>

      <Button
        onClick={validateOrder}
        className="flex-2"
        size="lg"
        disabled={orderPlaced}
      >
        Place order
      </Button>

      {orderPlaced && (
        <PlaceOrderProgress
          customOrder={customOrder}
          storeId={storeId}
          onComplete={() => setOrderPlaced(false)}
          data={data}
        />
      )}
    </div>
  );
}

interface PlaceOrderProgressProps {
  customOrder?: boolean;
  storeId?: string;
  onComplete: () => void;
  data?: ResponseCart;
}

function PlaceOrderProgress({
  customOrder = false,
  storeId,
  onComplete,
  data,
}: PlaceOrderProgressProps) {
  const { uploadedImages, instructions, resetCart, setUploadedImages } =
    useCartStore();
  const navigate = useNavigate();
  const { deliveryLocation } = useLocationStore();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const presignedMutation = useAPIMutation(
    loggedInUploadApi.presigned,
    "$post"
  );

  const orderMutation = useAPIMutation(
    customOrder ? loggedIOrderApi.custom : loggedIOrderApi.index,
    "$post",
    {
      onSuccess: (data: { orders: string[] }) => {
        setIsSuccess(true);
        setTimeout(() => {
          onComplete();

          const { orders } = data;
          if (orders.length === 1) {
            navigate({
              to: "/account/orders/$orderId",
              params: { orderId: orders[0] },
            });
          } else {
            navigate({ to: "/account/orders" });
          }
          queryClient.invalidateQueries({
            queryKey: apiQueryOptions(loggedInCartApi.index, "$get", {})
              .queryKey,
          });
          resetCart();
          setUploadedImages([]);
        }, 2500);
      },

      onError: () => {
        onComplete();
        toast.error("Failed to place order", {
          description: "Something went wrong while placing your order.",
        });
      },
    }
  );

  const hasPlacedOrder = useRef(false); // ✅ Guard ref

  const handlePlaceOrder = useCallback(async () => {
    if (hasPlacedOrder.current) return; // ✅ Skip if already called
    hasPlacedOrder.current = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const uploadedUrls: string[] = [];

      if (customOrder) {
        for (const file of uploadedImages) {
          const response = await presignedMutation.mutateAsync({
            json: {
              contentLength: file.size,
              contentType: file.type,
              filename: file.name,
            },
          });

          await fetch(response.presigned_url, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          uploadedUrls.push(`${env.CDN_URL}/${response.path}`);
        }
      }

      const stores = customOrder
        ? [
            {
              id: storeId as string,
              attachments: uploadedUrls,
              instruction: "",
            },
          ]
        : (data?.store ?? []).map((item) => ({
            id: item.storeId,
            instruction: "",
            attachments: [],
          }));

      await orderMutation.mutateAsync({
        json: {
          address: {
            ...deliveryLocation,
            country: deliveryLocation?.country ?? "",
            phone: deliveryLocation?.phone ?? "",
            lat: deliveryLocation?.lat ?? 0,
            lng: deliveryLocation?.lng ?? 0,
            line2: deliveryLocation?.line2 ?? "",
            postalCode: deliveryLocation?.postalCode ?? "",
            metadata: {
              building: deliveryLocation?.metadata?.building ?? "",
            },
          },
          deliveryInstruction: instructions.deliveryInstruction,
          stores,
        },
      });
    } catch {
      onComplete();
    }
  }, [
    uploadedImages,
    presignedMutation,
    orderMutation,
    customOrder,
    storeId,
    data?.store,
    deliveryLocation,
    instructions.deliveryInstruction,
    onComplete,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    handlePlaceOrder();
  }, []);

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-md w-[400px]">
        <div className="flex flex-col items-center text-center py-6">
          {isSuccess ? (
            <CircleCheck className="size-16 text-emerald-600 stroke-2" />
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          )}
          <h3 className="text-lg font-semibold mb-2">
            {isSuccess ? "Order placed successfully!" : "Placing your order..."}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isSuccess
              ? "Redirecting you to your orders..."
              : "Your order is being processed"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
