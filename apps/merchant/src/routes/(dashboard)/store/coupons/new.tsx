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
import { createFileRoute, Link } from "@tanstack/react-router";
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
    minimumOrderValue: 0,
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
        minimumOrderValue: data?.minimumOrderValue || 0,
      });
    }
  }, [isLoading]);

  const opts = {
    onSuccess: () => {
      toast.success("Coupon created successfully and activated");
    },
  };

  const couponMutation = useAPIMutation(merchantCouponApi.index, "$post", opts);
  const patchCoupon = useAPIMutation(merchantCouponApi[":id"], "$patch", opts);

  const onSubmit = async (data: typeof defaultValues) => {
    if (couponId) {
      await patchCoupon.mutateAsync({ param: { id: couponId }, json: data });
    } else {
      await couponMutation.mutateAsync({ json: data });
    }
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
                    placeholder={
                      type === "amount-off"
                        ? "25% off on all orders"
                        : "Free delivery on orders above ₹500"
                    }
                    required
                  />
                </Card>

                {type === "amount-off" && (
                  <Card className="bg-tertiary/50">
                    <CardHeader>
                      <CardTitle className="capitalize">
                        Discount value
                      </CardTitle>
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
                        suffixEl={
                          form.watch("discountType") === "percent" && "%"
                        }
                        prefixEl={form.watch("discountType") === "flat" && "₹"}
                        placeholder="0"
                        type="number"
                        min={0}
                        required
                      />
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-tertiary/50">
                  <CardHeader>
                    <CardTitle className="capitalize">
                      Minimum order requirement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormInput
                      name="minimumOrderValue"
                      label="Minimum order value to apply this coupon"
                      prefixEl={"₹"}
                      placeholder="0"
                      type="number"
                      wrapperClassName="max-w-96"
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
