import { merchantCategoryApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import { FormButton, FormInput } from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Form } from "@lipy/web-ui/components/ui/form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormEdit from "../-form.edit";

export const Route = createFileRoute("/(dashboard)/product/add/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: search.type as "category" | "product" | undefined,
      product: search.product as string | undefined,
    };
  },
});

function RouteComponent() {
  const { type, product } = Route.useSearch();

  return (
    <div>
      <DashboardHeader title={`Add ${type}`} />
      {type === "category" ? (
        <AddCategory />
      ) : (
        <FormEdit view={product ? "edit" : "create"} product={product} />
      )}
    </div>
  );
}

function AddCategory() {
  const defaultValues = {
    title: "",
  };

  const form = useForm({
    defaultValues,
  });

  const navigate = useNavigate();

  const mutation = useAPIMutation(merchantCategoryApi.index, "$post", {
    onSuccess: () => {
      toast.success("Category added successfully");
      form.reset();
      navigate({
        to: "/product",
        search: () => ({ page: "1", q: undefined }),
      });
    },
  });

  const onSubmit = async (data: typeof defaultValues) => {
    await mutation.mutateAsync({
      json: data,
    });
  };
  return (
    <div className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput
            name="title"
            label="Category Name"
            placeholder="Thali, Biryani, etc"
            required
          />

          <div className="mt-12  flex flex-col">
            <FormButton>Save Category</FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
