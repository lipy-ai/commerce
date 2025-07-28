import { loggedInStoreApi } from "@lipy/lib/api";
import { useStore } from "@lipy/lib/hooks/use-store";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import { UPIQRCode } from "@lipy/web-ui/components/custom-ui/upiCard";
import {
  FormInput,
  FormToggleGroup,
} from "@lipy/web-ui/components/forms/elements";
import {
  MultiStepLayout,
  useMultiStepForm,
} from "@lipy/web-ui/components/forms/multi-step";

import { useRouter } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  StorePolicesForm,
  defaultStorePolicies,
} from "../(dashboard)/store/policies";
export const Route = createFileRoute("/register/")({
  component: RouteComponent,
});

const storeTypes = [
  "grocery",
  "pharmacy",
  "fruits_and_vegetables",
  "restaurant",
  "cafe",
  "hardware",
];

const step1 = {
  id: "store_info",
  title: "Store Information",
  description: "Tell us about your store",
  children: () => (
    <>
      <FormInput
        label="Store Name"
        name="name"
        placeholder="Your Store Name"
        required
      />
      <FormInput
        label="Support Phone"
        name="phone"
        placeholder="Your Store Phone Number"
        required
      />
      <FormInput
        label="Support Email"
        name="email"
        placeholder="Your Store Email Address"
        required
      />
      <FormToggleGroup
        label="Store Category"
        name="type"
        opts={storeTypes.map((s) => ({
          label: s.replaceAll("_", " "),
          value: s,
        }))}
        required
        type="single"
      />
    </>
  ),
};
const step2 = {
  id: "store_address",

  title: "Store Address",
  description: "Tell us about your store.",
  children: () => (
    <>
      <FormInput
        label="Building / Flat / Shop no. "
        name="address.line1"
        required
      />
      <FormInput
        label="Locality Area / Land mark"
        name="address.line2"
        required
      />
      <div className="grid md:grid-cols-2 md:gap-4">
        <FormInput label="City" name="address.city" required />
        <FormInput label="Pin code" name="address.postalCode" required />
      </div>
      <div className="grid md:grid-cols-2 md:gap-4">
        <FormInput label="State" name="address.state" required />

        <FormInput label="Country" name="address.country" required />
      </div>
    </>
  ),
};

const step3 = {
  id: "store_payments",
  title: "Payments Information",
  description: "Tell us your UPI ID.",

  children: () => {
    const { data } = useMultiStepForm();
    const form = useFormContext();

    const payments = form.watch("payments");

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (!payments?.upiIds?.[0]?.name) {
        form.setValue("payments.upiIds.0.name", data?.store_info?.name);
      }
    }, [payments]);

    return (
      <div className="">
        <FormInput
          label="Store UPI ID"
          name="payments.upiIds[0].id"
          placeholder="upi@okhdfcbank"
          required
        />

        <div className="md:bg-accent/50 rounded p-0 md:p-4">
          <UPIQRCode
            upi={payments?.upiIds?.[0]?.id?.toLowerCase()}
            name={payments?.upiIds?.[0]?.name}
          />
        </div>
        {/* upi://pay?pa=upi@okhdfcbank&pn=Kundan%20Bhosale&aid=uGA2123gMvebQ */}
      </div>
    );
  },
};

const step4 = {
  id: "store_policies",
  title: "Store Policies",
  description: "Tell us about your store polices.",

  children: () => {
    const { data } = useMultiStepForm();
    const form = useFormContext();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      const values = form.getValues();
      form.reset({ ...values, ...defaultStorePolicies }, { keepDirty: true });
    }, []);
    const payments = form.watch("payments");

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (!payments?.upiIds?.[0]?.name) {
        form.setValue("payments.upiIds.0.name", data?.store_info?.name);
      }
    }, [payments]);
    return <StorePolicesForm />;
  },
};

function RouteComponent() {
  const router = useRouter();
  const store = useStore();

  const mutation = useAPIMutation(loggedInStoreApi.index, "$post", {
    onSuccess: async () => {
      router.navigate({ to: "/", reloadDocument: true });
    },
  });

  const handleSubmit = async (data: any) => {
    console.log(data);
    await mutation.mutateAsync({ json: data });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (store.isLoading) return;
    store.data?.id &&
      router.navigate({ from: "/register", to: "/", reloadDocument: true });
  }, [store.isLoading]);

  return (
    <MultiStepLayout
      loading={store.isLoading || !!store.data?.id}
      steps={[step1, step2, step3, step4]}
      onSubmit={handleSubmit}
    />
  );
}
