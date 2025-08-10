import type { posOrderApi } from "@lipy/lib/api";
import { usePosStore } from "@lipy/lib/hooks/use-store";
import {
  DrawerDialogClose,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { UPIQRCode } from "@lipy/web-ui/components/custom-ui/upiCard";
import { FormButton } from "@lipy/web-ui/components/forms/elements";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@lipy/web-ui/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@lipy/web-ui/components/ui/input-otp";
import type { InferRequestType } from "hono";
import { Check } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

type PatchTypes = InferRequestType<(typeof posOrderApi)[":id"]["$patch"]>;

export default function OrderDeliverForm({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: (json: PatchTypes["json"]) => Promise<void>;
}) {
  const defaultValues = {
    otp: "",
  };
  const form = useForm({ defaultValues });
  const [open, setOpen] = useState(false);
  const { data } = usePosStore();

  return (
    <DrawerDialogSwitcher
      trigger={children}
      className="sm:max-w-sm text-center h-[95vh]"
      open={open}
      onOpenChange={setOpen}
    >
      {form.formState.isSubmitSuccessful ? (
        <div className="space-y-4">
          <div className="p-4 rounded-full bg-primary text-primary-foreground inline-flex">
            <Check className="size-10" />
          </div>
          <DrawerDialogTitle>Delivery Confirmed</DrawerDialogTitle>
          <DrawerDialogDescription className="text-balance">
            Please collect payment from customer by showing this UPI QRCode.
          </DrawerDialogDescription>
          <div>
            {data?.payments?.upiIds[0].id && (
              <UPIQRCode
                upi={data?.payments?.upiIds[0].id}
                name={data?.payments?.upiIds[0].name}
              />
            )}
          </div>
          <Button
            type="button"
            size={"lg"}
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      ) : (
        <>
          <DrawerDialogHeader className="">
            <DrawerDialogTitle>Enter OTP</DrawerDialogTitle>
            <DrawerDialogDescription className="">
              We have sent an otp to customer, Please ask customer to share it
              with you.
            </DrawerDialogDescription>
          </DrawerDialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) =>
                onSubmit({ ...v, type: "delivered" }).catch((e) =>
                  form.setError("otp", {
                    type: "custom",
                    message: e.data.message,
                  })
                )
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP maxLength={5} inputMode="text" {...field}>
                        <InputOTPGroup className="grid grid-cols-5 w-full">
                          <InputOTPSlot index={0} className="h-14 w-full" />
                          <InputOTPSlot index={1} className="h-14 w-full" />
                          <InputOTPSlot index={2} className="h-14 w-full" />
                          <InputOTPSlot index={3} className="h-14 w-full" />
                          <InputOTPSlot index={4} className="h-14 w-full" />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerDialogFooter className="">
                <DrawerDialogClose className="flex-1">Cancel</DrawerDialogClose>
                <FormButton className="flex-1">Confirm Delivery</FormButton>
              </DrawerDialogFooter>
            </form>
          </Form>
        </>
      )}
    </DrawerDialogSwitcher>
  );
}
