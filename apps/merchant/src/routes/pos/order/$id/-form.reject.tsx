import type { posOrderApi } from "@lipy/lib/api";
import {
  DrawerDialogClose,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { FormButton, FormInput } from "@lipy/web-ui/components/forms/elements";
import { Form } from "@lipy/web-ui/components/ui/form";
import type { InferRequestType } from "hono";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

const defaultValues = {
  reason: "",
};
type PatchTypes = InferRequestType<(typeof posOrderApi)[":id"]["$patch"]>;

export default function OrderRejectForm({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: (json: PatchTypes["json"]) => Promise<void>;
}) {
  const form = useForm({ defaultValues });
  return (
    <DrawerDialogSwitcher trigger={children}>
      <DrawerDialogHeader className="">
        <DrawerDialogTitle>Are you sure?</DrawerDialogTitle>
        <DrawerDialogDescription className="">
          This will permanently cancel this order and this action is
          irreversible.
        </DrawerDialogDescription>
      </DrawerDialogHeader>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) =>
            onSubmit({ ...v, type: "cancel" })
          )}
        >
          <FormInput name="reason" label="Cancellation Reason?" />
          <DrawerDialogFooter>
            <DrawerDialogClose>Back</DrawerDialogClose>
            <FormButton>Cancel Order</FormButton>
          </DrawerDialogFooter>
        </form>
      </Form>
    </DrawerDialogSwitcher>
  );
}
