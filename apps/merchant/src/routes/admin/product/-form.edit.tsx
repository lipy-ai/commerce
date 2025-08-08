import { adminProductApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import {
  DrawerDialogClose,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import {
  FormButton,
  FormInput,
  FormMultiImage,
  FormSelect,
  FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Form, FormItem, FormLabel } from "@lipy/web-ui/components/ui/form";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@lipy/web-ui/components/ui/sortable";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { InferRequestType } from "hono";
import { GripVertical, Trash } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useProductInvalidate, useVariantInvalidate } from "./-hook-invalidate";
import { useProduct } from "./-provider";
import { VariantForm } from "./-variation";

export default function FormEdit() {
  const [open, setOpen] = useState(false);
  const { view, product } = useSearch({ from: "/admin/product/" });
  const navigate = useNavigate({ from: "/admin/product" });

  const { data: list } = useProduct();

  const defaultValues: InferRequestType<
    typeof adminProductApi.index.$post
  >["json"] = {
    title: "",
    category: "",
    summary: "",
    images: [],
    highlights: [],
    information: [],
    variants: [],
  };

  const { invalidate } = useProductInvalidate();
  const { invalidate: variantInvalidate } = useVariantInvalidate();

  const form = useForm({
    defaultValues,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (view === "create") {
      setOpen(true);
      form.reset({});
    }

    if (view === "edit" && list && product) {
      const data = list?.items.find((l) => l.id === product);
      if (!data) {
        toast("No such product found...");
      } else {
        setOpen(true);
        form.reset({
          title: data?.title || "",
          category: data?.category?.id || "",
          summary: data?.summary || "",
          images: data?.images || [],
          highlights: data?.highlights || [],
          information: data?.information || [],
          variants: (data?.variants || []) as any,
        });
      }
    }
  }, [view, list, product]);

  const opts = {
    onMutate: () => {},
    onError: () => {
      invalidate();
    },
    onSuccess: () => {
      variantInvalidate();
    },
  };

  const mutation = useAPIMutation(adminProductApi[":id"], "$patch", opts);

  const createMutation = useAPIMutation(adminProductApi.index, "$post", opts);

  const onSubmit = async (body: typeof defaultValues) => {
    if (!product) return await createMutation.mutateAsync({ json: body });

    await mutation.mutateAsync({ param: { id: product }, json: body });
  };

  return (
    <DrawerDialogSwitcher
      className="sm:max-w-5xl"
      open={open}
      onOpenChange={(v) => {
        setOpen(v);

        if (!v) {
          navigate({
            search: (s) => ({ ...s, view: undefined, product: undefined }),
          });
          form.reset(defaultValues);
        }
      }}
    >
      <DrawerDialogHeader>
        <DrawerDialogTitle>
          {view === "create" ? "Create Product" : "Edit Product"}
        </DrawerDialogTitle>
      </DrawerDialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
          <div>
            <FormInput name="title" label="Title" placeholder="Product Title" />

            <FormSelect
              name="category"
              type="categories"
              label="Category"
              placeholder="Search Categories"
            />

            <FormTextarea
              name="summary"
              label="Summary"
              placeholder="Brief summary about this product..."
            />
            <FormItem>
              <FormLabel>Images</FormLabel>

              <FormMultiImage name="images" />
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
            <FormButton>Save Changes</FormButton>
          </DrawerDialogFooter>
        </form>
      </Form>
    </DrawerDialogSwitcher>
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
