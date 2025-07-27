import { merchantStoreApi } from "@lipy/lib/api";
import { useStore } from "@lipy/lib/hooks/use-store";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
  apiQueryOptions,
  useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import {
  FormButton,
  FormInput,
  FormRadioInput,
  FormSlider,
  FormSwitch,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import {
  Form,
  FormDescription,
  FormLabel,
} from "@lipy/web-ui/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@lipy/web-ui/components/ui/radio-group";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  format,
  getHours,
  getMinutes,
  parse,
  setHours,
  setMinutes,
} from "date-fns";
import { useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { StoreNav } from "./-nav";

function timeToDecimal(timeStr: string): number {
  const time = parse(timeStr, "HH:mm", new Date());
  return getHours(time) + getMinutes(time) / 60;
}

function decimalToTime(decimal: number): string {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  const time = setMinutes(setHours(new Date(), hours), minutes);
  return format(time, "HH:mm");
}

function formatToHrMm(time: string): string {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
}

export const Route = createFileRoute("/(dashboard)/store/policies")({
  component: RouteComponent,
});

const defaultValues = {
  refunds: { enabled: false, content: "" },
  replacements: { enabled: false, content: "" },
  deliveryDistance: 1,
  freeDeliveryDistance: 1,
  gstTax: "0",
  openingHour: decimalToTime(0),
  closingHour: decimalToTime(0),
};

function RouteComponent() {
  const { data } = useStore();
  const form = useForm({ defaultValues });

  const queryClient = useQueryClient();
  const qOpts = apiQueryOptions(merchantStoreApi.index, "$get", {});
  const mutation = useAPIMutation(merchantStoreApi.index, "$patch", {
    onSettled() {
      queryClient.invalidateQueries({ queryKey: qOpts.queryKey });
    },
  });

  const onSubmit = (v: typeof defaultValues) => {
    mutation.mutateAsync({ json: v as any });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!data) return;
    form.reset({
      refunds: data.refunds || defaultValues.refunds,
      replacements: data.replacements || defaultValues.replacements,
      deliveryDistance: data.deliveryDistance,
      freeDeliveryDistance: data.freeDeliveryDistance,
      gstTax: String(data.gstTax) || defaultValues.gstTax,
      openingHour: formatToHrMm(data.openingHour),
      closingHour: formatToHrMm(data.closingHour),
    });
  }, [data]);

  return (
    <>
      <DashboardHeader title="Store Policies" />
      <StoreNav>
        <Card className="flex-1 p-4  md:p-8">
          <CardHeader>
            <CardTitle>Store Polices</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <Form {...form}>
              <form
                className="max-w-2xl"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <StorePolicesForm />
                <br />
                <FormButton>Save Changes</FormButton>
              </form>
            </Form>
          </CardContent>
        </Card>
      </StoreNav>
    </>
  );
}

export function StorePolicesForm() {
  const form = useFormContext();
  const gstOpts = [
    {
      value: "0",
      label: "No Tax",
    },
    {
      value: "5",
      label: "5% Tax",
    },
    {
      value: "12",
      label: "12% Tax",
    },
    {
      value: "18",
      label: "18% Tax",
    },
    {
      value: "28",
      label: "28% Tax",
    },
  ];
  const [openingHrs, closingHrs] = form.watch(["openingHour", "closingHour"]);

  const openNum = timeToDecimal(openingHrs || "00:00");
  const closeNum = timeToDecimal(closingHrs || "00:00");

  const hrsVal =
    openNum === 0 && closeNum === 0
      ? "24hrs"
      : openNum === 9 && closeNum === 23
        ? "9-11"
        : "custom";

  const handleValChange = (v: string) => {
    let openV = 0;
    let closeV = 0;

    if (v === "24hrs") {
      openV = 0;
      closeV = 0;
    }

    if (v === "9-11") {
      openV = 9;
      closeV = 23;
    }

    if (v === "custom") {
      openV = openNum + 1;
      closeV = closeNum;
    }

    form.setValue("openingHour", decimalToTime(openV));
    form.setValue("closingHour", decimalToTime(closeV));
  };

  return (
    <>
      <div className="space-y-8">
        <div className="bg-accent/30 rounded border">
          <div className="space-y-1 p-4">
            <FormLabel>Store Opening Hours</FormLabel>
          </div>

          <div className="p-4 bg-card">
            <RadioGroup value={hrsVal} onValueChange={handleValChange}>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="24hrs" id="r1" />
                <FormLabel htmlFor="r1">24 hours</FormLabel>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="9-11" id="r2" />
                <FormLabel htmlFor="r2">9 am to 11 pm</FormLabel>
              </div>
              <div className="flex items-top gap-3">
                <RadioGroupItem value="custom" id="r3" />
                <div className="flex items-center flex-wrap gap-6 w-full justify-between">
                  <FormLabel htmlFor="r3">Custom</FormLabel>
                  <div className="flex items-center gap-2 h-4 relative -top-1">
                    <FormInput
                      type="time"
                      name="openingHour"
                      placeholder="Opens At"
                      wrapperClassName="mb-0 w-fit"
                      className="h-6"
                      style={{ fontSize: "0.8rem" }}
                    />
                    To
                    <FormInput
                      type="time"
                      name="closingHour"
                      placeholder="Closes At"
                      wrapperClassName="mb-0 w-fit"
                      className="h-6"
                      style={{ fontSize: "0.8rem" }}
                    />
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="bg-accent/30 rounded border">
          <div className="space-y-1 p-4">
            <FormLabel>Home Delivery</FormLabel>
            {/* <FormDescription>Do you provide refunds?</FormDescription> */}
          </div>

          <div className="p-4 bg-card">
            <FormSlider
              name="deliveryDistance"
              label="Distance"
              suffix="kms"
              maxLabel="100+"
            />
          </div>
        </div>
        <div className="bg-accent/30 rounded border">
          <div className="space-y-1 p-4">
            <FormLabel>Delivery Charges</FormLabel>
          </div>
          <div className="p-4 bg-card">
            <FormSlider
              name="freeDeliveryDistance"
              label="Free Delivery"
              prefix="Till"
              suffix="kms"
            />

            <FormLabel className="flex pt-2 flex-wrap">
              {formatAmount("inr", 10)} per km delivery charge.
              <span className="text-muted-foreground font-normal">
                (Applicable for orders out of free delivery range.)
              </span>
            </FormLabel>
          </div>
        </div>
        <div className="bg-accent/30 rounded border">
          <div className="space-y-1 p-4">
            <FormLabel>Goods and Service Tax (GST)</FormLabel>
          </div>
          <div className="p-4 bg-card">
            <FormRadioInput name="gstTax" opts={gstOpts} />
          </div>
        </div>
        <div className="flex items-center justify-between bg-accent/30 rounded border p-4">
          <div className="space-y-1">
            <FormLabel>Refunds</FormLabel>
            <FormDescription>Do you provide refunds?</FormDescription>
          </div>
          <FormSwitch name="refunds.enabled" wrapperClassName="w-fit" />
        </div>
        <div className="flex items-center justify-between bg-accent/30 rounded border p-4">
          <div className="space-y-1">
            <FormLabel>Replacements</FormLabel>
            <FormDescription>Do you provide replacements?</FormDescription>
          </div>
          <FormSwitch name="replacements.enabled" wrapperClassName="w-fit" />
        </div>
      </div>
    </>
  );
}
