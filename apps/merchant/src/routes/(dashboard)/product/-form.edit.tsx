import { merchantProductApi } from "@lipy/lib/api";
import { useAPIMutation, useAPIQuery } from "@lipy/lib/utils/useQueryClient";
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
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
} from "@lipy/web-ui/components/ui/form";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@lipy/web-ui/components/ui/sortable";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { GripVertical, Trash } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { VariantForm } from "./-variation";

export default function FormEdit() {
  const [open, setOpen] = useState(false);
  const { product, view } = useSearch({ from: "/(dashboard)/product/add" });
  const navigate = useNavigate({ from: "/product/add" });

  const defaultValues = {
    title: "",
    category: "",
    price: 0,
    maxPrice: 0,
    summary: "",
    images: [],
    highlights: [],
    information: [],
    variants: [],
  };

  const opts = {
    onMutate: () => {},
    onError: () => {},
    onSuccess: () => {
      toast.success(
        "Your product is under review. You can add it in your inventory in sometime."
      );
      setOpen(false);
    },
  };

  const form = useForm({
    defaultValues,
  });

  const { data, isLoading } = useAPIQuery(
    merchantProductApi[":id"],
    "$get",
    {
      param: { id: product! },
    },
    {
      enabled: !!product,
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppress dependencies
  useEffect(() => {
    if (view === "create") {
      setOpen(true);
      form.reset({});
    }

    if (view === "edit") {
      setOpen(true);
      if (data) {
        form.reset({
          title: data?.title || "",
          category: data?.category?.id || "",
          summary: data?.summary || "",
          images: data?.images || ([] as any),
          highlights: data?.highlights || ([] as any),
          information: data?.information || ([] as any),
          variants: (data?.variants || []) as any,
        });
      }
    }
  }, [view, isLoading]);

  const updateProductMutation = useAPIMutation(
    merchantProductApi[":id"],
    "$patch",
    opts
  );

  const createProductMutation = useAPIMutation(
    merchantProductApi.index,
    "$post",
    opts
  );

  const onSubmit = async (body: any) => {
    console.log(body);
    if (data?.id && view === "edit") {
      await updateProductMutation.mutateAsync({
        param: { id: data.id },
        json: body,
      });
    } else {
      await createProductMutation.mutateAsync({
        json: body,
      });
    }
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
            replace: true,
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
      {isLoading ? (
        <Skeleton className="m-4 max-w-5xl h-96" />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
            <div className="grid">
              <FormInput
                name="title"
                label="Title"
                placeholder="Product Title"
                required
              />

              <FormSelect
                name="category"
                type="categories"
                label="Category"
                placeholder="Search Categories"
              />
              <VariantForm />

              <FormTextarea
                name="summary"
                label="Summary"
                placeholder="Brief summary about this product..."
              />
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormDescription>
                  First image will be used as thumbnail
                </FormDescription>
                <FormMultiImage name="images" />
              </FormItem>
              <br />
              <SortableForm name="highlights" label="Highlights" />
              <br />
              <SortableForm name="information" label="More Information" />
            </div>
            <DrawerDialogFooter>
              <DrawerDialogClose />
              <FormButton disabled={!form.formState.isValid}>
                Save Changes
              </FormButton>
            </DrawerDialogFooter>
          </form>
        </Form>
      )}
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
                            variant="secondary"
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
