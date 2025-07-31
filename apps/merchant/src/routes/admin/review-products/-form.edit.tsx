import {
  DrawerDialogClose,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Form, FormItem, FormLabel } from "@lipy/web-ui/components/ui/form";

import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import {
  ActionButton,
  FormButton,
  FormImage,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import type { InferRequestType, InferResponseType } from "hono";

import { adminReviewProductApi } from "@lipy/lib/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@lipy/web-ui/components/ui/sortable";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, GripVertical, Trash } from "lucide-react";
import { Fragment, type ReactNode, useState } from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useProductInvalidate } from "./-hook-invalidate";
import { VariantForm } from "./-variation";

export default function FormEdit({
  type,
  data,
  children,
}: {
  data?:
    | InferResponseType<
        (typeof adminReviewProductApi.index)["$get"]
      >["items"][0]
    | undefined;
  type: "create" | "update";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const defaultValues: InferRequestType<
    typeof adminReviewProductApi.index.$post
  >["json"] = {
    title: data?.title || "",
    category: data?.category?.id || "",
    summary: data?.summary || "",
    images: data?.images || [],
    highlights: data?.highlights || [],
    information: data?.information || [],
    variants: (data?.variants || []) as any,
  };

  const form = useForm({
    defaultValues,
  });

  const opts = {
    onMutate: () => {},
    onError: () => {
      invalidate();
    },
    form,
  };

  const mutation = useAPIMutation(adminReviewProductApi[":id"], "$patch", opts);
  const publishMu = useAPIMutation(
    adminReviewProductApi[":id"].publish,
    "$post",
    opts
  );

  const createMutation = useAPIMutation(
    adminReviewProductApi.index,
    "$post",
    opts
  );

  const { invalidate } = useProductInvalidate();

  const onSubmit = async (body: typeof defaultValues) => {
    if (!data?.id) return await createMutation.mutateAsync({ json: body });
    await mutation.mutateAsync({ param: { id: String(data.id) }, json: body });
  };

  return (
    <>
      <DrawerDialogSwitcher
        className="sm:max-w-5xl"
        open={open}
        onOpenChange={setOpen}
        trigger={children}
      >
        <DrawerDialogHeader>
          <DrawerDialogTitle>
            {type === "create" ? "Create Product" : "Edit Product"}
          </DrawerDialogTitle>
        </DrawerDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
            <div>
              <FormInput
                name="title"
                label="Title"
                placeholder="Product Title"
              />

              <FormSelect
                name="category"
                type="categories"
                label="Category"
                placeholder="Search Categories"
              />
              <div className="flex gap-2">
                <Badge>{data?.primaryCategory}</Badge>
                <Badge>{data?.subCategory}</Badge>
              </div>
              <br />

              <FormTextarea
                name="summary"
                label="Summary"
                placeholder="Brief summary about this product..."
              />
              <FormItem>
                <FormLabel>Images</FormLabel>

                <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                  {data?.images?.map((m, i) => (
                    <FormImage
                      key={m}
                      name={`images.${i}`}
                      wrapperClassName="size-full"
                    />
                  ))}
                </div>
              </FormItem>
              <br />
              <VariantForm />
              <br />
              <SortableForm name="highlights" label="Highlights" />
              <br />
              <SortableForm name="information" label="More Information" />
            </div>
            <DrawerDialogFooter>
              <DrawerDialogClose />
              {data?.reviewedAt && data.productId ? (
                <Link
                  className={cn(buttonVariants({}))}
                  to={"/admin/product/$id"}
                  params={{ id: data.productId! }}
                >
                  Published <ArrowUpRight />
                </Link>
              ) : (
                <>
                  <ActionButton
                    type="button"
                    onClick={() =>
                      data?.id &&
                      publishMu.mutate({ param: { id: String(data.id) } })
                    }
                    isPending={publishMu.isPending}
                    isSuccessful={publishMu.isSuccess}
                    isError={publishMu.isError}
                  >
                    Publish
                  </ActionButton>
                  <FormButton>Save Changes</FormButton>
                </>
              )}
            </DrawerDialogFooter>
          </form>
        </Form>
      </DrawerDialogSwitcher>
    </>
  );
}

function SortableForm({ name, label }: { name: string; label: string }) {
  const form = useFormContext();

  const arr = useFieldArray({
    name,
    control: form.control,
    keyName: "kid",
  });

  const watch = useWatch({ name });

  return (
    <div>
      <div className="flex justify-between p-4 bg-accent/50">
        <FormLabel>{label}</FormLabel>

        <Button
          variant={"outline"}
          size={"sm"}
          type="button"
          onClick={() => {
            arr.prepend({ name: "Untitled", value: "Untitled" });
          }}
        >
          Add New
        </Button>
      </div>

      <Sortable
        value={arr.fields}
        onValueChange={(v) =>
          form.setValue(name as any, v, { shouldValidate: true })
        }
        getItemValue={(item) => item.kid}
      >
        <SortableContent asChild>
          <Accordion type="single" collapsible>
            {arr.fields.map((f: any, i) => {
              return (
                <Fragment key={f.kid}>
                  <SortableItem key={f.kid} value={f.kid} asChild>
                    <AccordionItem
                      value={f.kid}
                      className="hover:bg-accent/50 data-[state=open]:bg-accent/20 data-[state=open]:border"
                    >
                      <AccordionTrigger className="data-[state=open]:border-b">
                        <div className="flex gap-2 items-center w-full">
                          <SortableItemHandle asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <GripVertical className="h-4 w-4" />
                            </Button>
                          </SortableItemHandle>
                          <div className="text-start flex-1">
                            <p>{watch[i]?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {watch[i]?.value}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => {
                              arr.remove(i);
                            }}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4">
                        <FormInput
                          name={`${name}.${i}.name`}
                          placeholder={`${name} Key`}
                        />
                        <FormTextarea
                          name={`${name}.${i}.value`}
                          placeholder={`${name} Value`}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </SortableItem>
                </Fragment>
              );
            })}
          </Accordion>
        </SortableContent>
        <SortableOverlay>
          <div className="size-full rounded-none bg-primary/10" />
        </SortableOverlay>
      </Sortable>
    </div>
  );
}
