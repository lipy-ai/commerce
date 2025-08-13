import { merchantCouponApi } from "@lipy/lib/api";
import { useAPIMutation, useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { COUPON_TYPE, type SUM_TYPE } from "@lipy/server/db/schema";
import {
  FormButton,
  FormDropdown,
  FormInput,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@lipy/web-ui/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Form } from "@lipy/web-ui/components/ui/form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { StoreNav } from "../-nav";

export const Route = createFileRoute("/(dashboard)/store/coupons/new")({
  component: RouteComponent,
  validateSearch: z.object({
    type: z.enum(COUPON_TYPE).optional(),
    couponId: z.string().optional(),
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { type, couponId } = Route.useSearch();

  const { data, isLoading } = useAPIQuery(
    merchantCouponApi[":id"],
    "$get",
    {
      param: {
        id: couponId as string,
      },
    },
    {
      enabled: !!couponId,
    }
  );

  const defaultValues = {
    title: "",
    discountType: "percent" as (typeof SUM_TYPE)[number],
    discountValue: 0,
    type: type || "amount-off",
  };

  const form = useForm({
    defaultValues,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress dependencies
  useEffect(() => {
    if (!isLoading && data) {
      form.reset({
        title: data?.title || "",
        discountType: data?.discountType || "percent",
        discountValue: data?.discountValue || 0,
        type: data?.type || "amount-off",
      });
    }
  }, [isLoading]);

  const opts = {
    onSuccess: () => {
      toast.success("Coupon created successfully and activated");
      navigate({ to: "/store/coupons" });
    },
  };

  const couponMutation = useAPIMutation(merchantCouponApi.index, "$post", opts);

  const onSubmit = (data: typeof defaultValues) => {
    couponMutation.mutate({ json: data });
  };

  return (
    <>
      <DashboardHeader title="Create Coupon" />
      <StoreNav>
        <Breadcrumb>
          <BreadcrumbList className="text-base font-medium">
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/store/coupons">Coupons</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base font-medium">
                Create Coupon
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="md:grid md:grid-cols-12 py-4">
              <div className="md:col-span-8 space-y-4">
                <Card className="bg-tertiary/50">
                  <CardHeader>
                    <CardTitle className="capitalize">
                      {type?.replace("-", " ")}
                    </CardTitle>
                  </CardHeader>
                  <FormInput
                    name="title"
                    label="Title"
                    description="Short and descriptive name of the discount"
                    placeholder="25% off on all orders"
                    required
                  />
                </Card>

                <Card className="bg-tertiary/50">
                  <CardHeader>
                    <CardTitle className="capitalize">Discount value</CardTitle>
                  </CardHeader>
                  <CardContent className="md:grid md:grid-cols-2 gap-4">
                    <FormDropdown
                      name="discountType"
                      wrapperClassName="block"
                      opts={[
                        { value: "flat", label: "(+/-) Flat" },
                        { value: "percent", label: "(%) Percent" },
                      ]}
                    />
                    <FormInput
                      name="discountValue"
                      suffixEl={form.watch("discountType") === "percent" && "%"}
                      prefixEl={form.watch("discountType") === "flat" && "₹"}
                      placeholder="0"
                      type="number"
                      min={0}
                      required
                    />
                  </CardContent>
                </Card>
                <FormButton type="submit">Save</FormButton>
              </div>
            </div>
          </form>
        </Form>
      </StoreNav>
    </>
  );
}
