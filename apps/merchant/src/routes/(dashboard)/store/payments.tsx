import { UPIQRCode } from "@lipy/web-ui/components/custom-ui/upiCard";
import { FormButton, FormInput } from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Form } from "@lipy/web-ui/components/ui/form";

import { merchantStoreApi } from "@lipy/lib/api";
import { useStore } from "@lipy/lib/hooks/use-store";
import {
  apiQueryOptions,
  useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StoreNav } from "./-nav";

export const Route = createFileRoute("/(dashboard)/store/payments")({
  component: RouteComponent,
});

function RouteComponent() {
  const defaultValues = {
    payments: {
      upiIds: [
        {
          id: "",
          name: "",
        },
      ],
    },
  };
  const { data } = useStore();
  const queryClient = useQueryClient();
  const qOpts = apiQueryOptions(merchantStoreApi.index, "$get", {});

  const mutation = useAPIMutation(merchantStoreApi.index, "$patch", {
    onSettled() {
      queryClient.invalidateQueries({ queryKey: qOpts.queryKey });
    },
  });

  const form = useForm({ defaultValues });

  const payments = form.watch("payments");

  const onSubmit = async (v: typeof defaultValues) => {
    await mutation.mutateAsync({ json: v });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!data) return;
    form.reset({ payments: data.payments || defaultValues.payments });
  }, [data]);

  return (
    <>
      <DashboardHeader title="Store Payments" />
      <StoreNav>
        <Card className="flex-1 md:p-8">
          <CardContent className="flex-1">
            <Form {...form}>
              <form
                className="max-w-2xl space-y-8"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="">
                  <FormInput
                    label="UPI Id"
                    name="payments.upiIds[0].id"
                    placeholder="upi@okhdfcbank"
                    required
                  />
                  <FormInput
                    label="Name as per UPI"
                    name="payments.upiIds[0].name"
                    placeholder="Store / Receiver Name"
                    required
                  />
                  <div className="bg-accent/50 rounded p-4">
                    <UPIQRCode
                      upi={payments.upiIds?.[0]?.id?.toLowerCase()}
                      name={payments.upiIds?.[0]?.name}
                    />
                  </div>
                </div>
                <FormButton className="w-full">Save Payment</FormButton>
              </form>
            </Form>
          </CardContent>
        </Card>
      </StoreNav>
    </>
  );
}
