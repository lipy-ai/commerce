import { env } from "@envClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { loggedInAddressApi } from "@lipy/lib/api";
// @ts-nocheck
import { authClient } from "@lipy/lib/providers/auth";
import {
  apiQueryOptions,
  useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import { CustomRadioGroup } from "@lipy/web-ui/components/custom-ui/customRadioGroup";
import {
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import {
  FormButton,
  FormInputWithAnimatedLabel,
} from "@lipy/web-ui/components/forms/elements";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@lipy/web-ui/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  type AddressType,
  useLocationStore,
} from "@lipy/web-ui/components/maps/utils/store";
import { Button } from "@lipy/web-ui/components/ui/button";
import { AddressSetter } from "./addressSetter";
import { PenLine } from "lucide-react";

const addressTypesItems = [
  { value: "home", label: "Home" },
  { value: "work", label: "Work" },
  { value: "other", label: "Other" },
];

export function DetailedAddress({
  fullAddress,
  label,
  open,
  onOpenChange,
  isDeliveryAddress,
  children,
}: {
  fullAddress: AddressType;
  label: "Edit" | "Add";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDeliveryAddress?: boolean;
  children?: React.ReactNode;
}) {
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();
  const { setDeliveryLocation, deliveryLocation } = useLocationStore();

  const formSchema = z.object({
    building: z.string().min(2, "Please fill your detailed address"),
    addressType: z.enum(["home", "work", "other"]),
    receiverName: z.string().optional(),
    receiverPhone: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      building: fullAddress.metadata?.building || "",
      addressType: fullAddress.tag || "home",
      receiverName: fullAddress.name || data?.user?.name || "",
      receiverPhone: fullAddress.phone || "",
    },
  });

  const mutation = useAPIMutation(loggedInAddressApi.index, "$post", {
    onSuccess: () => {
      toast.success("Address saved successfully");
      queryClient.invalidateQueries({
        queryKey: apiQueryOptions(loggedInAddressApi.index, "$get", {})
          .queryKey,
      });

      onOpenChange?.(false);
      window.location.href = `${env.WEB_URL}/account/addresses`;
    },
    onError: () => toast.error("Something went wrong while adding address"),
  });

  const editMutation = useAPIMutation(loggedInAddressApi[":id"], "$patch", {
    onSuccess: () => {
      toast.success("Address updated successfully");

      queryClient.invalidateQueries({
        queryKey: apiQueryOptions(loggedInAddressApi.index, "$get", {})
          .queryKey,
      });
      onOpenChange?.(false);
    },
    onError: () => toast.error("Something went wrong while editing address"),
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const basePayload = {
      name: values.receiverName || fullAddress.name,
      country: fullAddress.country ?? "",
      tag: values.addressType,
      line2: "",
      city: fullAddress.city,
      state: fullAddress.state,
      postalCode: fullAddress.postalCode ?? "",
      phone: values.receiverPhone,
      lat: fullAddress.lat ?? undefined,
      lng: fullAddress.lng ?? undefined,
      line1: fullAddress.line1,
      metadata: {
        building: values.building,
      },
    };

    if (!isDeliveryAddress && label === "Add") {
      await mutation.mutateAsync({
        json: {
          ...basePayload,
        },
      });
    } else if (!isDeliveryAddress && label === "Edit") {
      await editMutation.mutateAsync({
        param: { id: fullAddress.id as string },
        json: {
          ...basePayload,
        },
      });
    }

    if (isDeliveryAddress) {
      setDeliveryLocation({
        ...deliveryLocation,
        name: basePayload.name,
        tag: values.addressType,
        line1: fullAddress.line1,
        phone: basePayload.phone || "",
        metadata: {
          building: values.building,
        },
      });
      onOpenChange?.(false);
    }
  };

  return (
    <DrawerDialogSwitcher
      open={open}
      onOpenChange={onOpenChange}
      trigger={<p>{children}</p>}
      className="z-[998]"
    >
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 w-full"
          >
            <DrawerDialogHeader className="pb-0">
              <DrawerDialogTitle>Add address details</DrawerDialogTitle>
            </DrawerDialogHeader>

            <div className="text-sm rounded-md border p-2 bg-accent/30 font-medium space-y-2">
              <p>{fullAddress?.line1}</p>
              <AddressSetter>
                <Button
                  className=""
                  variant={"outline"}
                  size="sm"
                  // onClick={handleChange}
                >
                  <PenLine /> Change Address
                </Button>
              </AddressSetter>
            </div>

            <FormInputWithAnimatedLabel
              name="building"
              label="Flat No. / House No. / Building Name *"
              required
            />

            <FormField
              control={form.control}
              name="addressType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground font-semibold">
                    Address type
                  </FormLabel>
                  <FormControl>
                    <CustomRadioGroup {...field} items={addressTypesItems} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormLabel className="text-muted-foreground font-semibold">
              Receiver's Details
            </FormLabel>

            <FormInputWithAnimatedLabel
              name="receiverName"
              label="Receiver's Name (optional)"
            />

            <FormInputWithAnimatedLabel
              name="receiverPhone"
              label="Receiver's Phone *"
              required
              type="tel"
            />

            <DrawerDialogFooter>
              <FormButton
                type="submit"
                className="w-full"
                disabled={
                  form.formState.isSubmitting ||
                  !form.formState.isValid ||
                  form.formState.isSubmitSuccessful ||
                  !form.formState.isDirty
                }
              >
                {isDeliveryAddress ? "Save and continue" : "Save"}
              </FormButton>
            </DrawerDialogFooter>
          </form>
        </Form>
      </div>
    </DrawerDialogSwitcher>
  );
}
