import { merchantStoreApi } from "@lipy/lib/api";
import {
  apiQueryOptions,
  useAPIMutation,
  useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import {
  FormButton,
  FormImage,
  FormInput,
  FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import VerticalListSkeleton from "@lipy/web-ui/components/layouts/skeletons/verticalListSkeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Form } from "@lipy/web-ui/components/ui/form";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StoreNav } from "./-nav";

export const Route = createFileRoute("/(dashboard)/store/general")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useAPIQuery(merchantStoreApi.index, "$get", {});

  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      image: "",
      name: "",
      handle: "",
      description: "",
      email: "",
      phone: "",
    },
  });

  // Update form when API data loads
  useEffect(() => {
    if (data) {
      form.reset({
        image: data.image || "",
        name: data.name || "",
        handle: data.handle || "",
        description: data.description || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    }
  }, [data, form.reset]);

  const updateMutation = useAPIMutation(merchantStoreApi.index, "$patch", {
    form,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: apiQueryOptions(merchantStoreApi.index, "$get", {}).queryKey,
      });
      toast.success("Details updated");
    },
  });

  const onSubmit = async (json: any) => {
    await updateMutation.mutateAsync({ json });
  };

  if (isLoading) {
    return (
      <div>
        <DashboardHeader />
        <div className="p-4 lg:p-8 max-w-5xl">
          <VerticalListSkeleton count={8} />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <DashboardHeader title="My Store" />
      <StoreNav>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1  md:p-8 "
        >
          <div className="grid divide-y lg:gap-4 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormImage
                  name="image"
                  label="Image"
                  wrapperClassName="size-20 mb-4"
                />
                <FormInput
                  name="name"
                  label="Name"
                  placeholder="Flower Mart"
                  required
                />
                <FormInput
                  name="handle"
                  label="Handle"
                  // prefixEl={`${env.WEB_URL}/@`}
                  required
                />
                <FormTextarea
                  name="description"
                  label="Bio"
                  placeholder="Tell us about your shop..."
                />

                <div className="grid lg:grid-cols-2 lg:gap-4">
                  <FormInput name="email" label="Email" />
                  <FormInput name="phone" label="Phone Number" />
                </div>
              </CardContent>

              <CardFooter className="">
                <FormButton>Save Changes</FormButton>
              </CardFooter>
            </Card>
          </div>
        </form>
      </StoreNav>
    </Form>
  );
}
