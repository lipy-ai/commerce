// import { merchantProductApi } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
// import {
//   apiQueryOptions,
//   useAPIMutation,
// } from "@lipy/lib/utils/useQueryClient";
// import {
//   DrawerDialogClose,
//   DrawerDialogFooter,
//   DrawerDialogHeader,
//   DrawerDialogSwitcher,
//   DrawerDialogTitle,
// } from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { FormInput } from "@lipy/web-ui/components/forms/elements";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Button } from "@lipy/web-ui/components/ui/button";
import { FormLabel } from "@lipy/web-ui/components/ui/form";
// import { cn } from "@lipy/web-ui/lib/utils";
// import { useQueryClient } from "@tanstack/react-query";
// import type { InferResponseType } from "hono";
import { ArrowRight, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

// export function ProductVariationForm({
//   data,
// }: {
//   data?: Partial<
//     InferResponseType<(typeof merchantProductApi)[":id"]["$get"]>["variants"][0]
//   >;
// }) {
//   const [open, setOpen] = useState(false);
//   const queryClient = useQueryClient();

//   const onSuccess = () => {
//     queryClient.invalidateQueries({
//       queryKey: apiQueryOptions(merchantProductApi[":id"], "$get", {
//         param: { id: data?.productId! },
//       }).queryKey,
//     });
//     setOpen(false);
//   };

//   const updateMutation = useAPIMutation(merchantProductApi[":id"], "$patch", {
//     onSuccess,
//   });

//   const defaultValues = {
//     price: data?.price || 0,
//     unit: data?.unit || "",
//     images: data?.images || [],
//   };

//   const form = useForm({
//     defaultValues,
//   });

//   const handle = async (d: typeof defaultValues) => {
//     const json = { ...d, productId: data?.productId! };
//     data?.id
//       ? await updateMutation.mutateAsync({ json, param: { id: data?.id! } })
//       : null;
//   };

//   return (
//     <>
//       <div
//         onClick={() => setOpen(true)}
//         className={cn(
//           "text-sm border relative cursor-pointer hover:bg-accent p-4",
//           !data?.id && "border-dashed"
//         )}
//       >
//         <div className="text-sm md:text-base flex justify-between items-center">
//           {data?.images?.[0] && (
//             <div>
//               <img
//                 className=""
//                 src={data?.images?.[0]}
//                 alt={`Variant - ${data?.unit}`}
//               />
//             </div>
//           )}
//           {data?.unit && (
//             <div>
//               <span>{data?.unit}</span>
//             </div>
//           )}
//           <div className={cn("flex gap-1")}>
//             {!data?.id ? <Plus /> : "₹"}
//             <span>{!data?.id ? "Add New Variant" : data?.price}</span>
//           </div>
//         </div>
//       </div>
//       <DrawerDialogSwitcher open={open} onOpenChange={setOpen}>
//         <DrawerDialogHeader>
//           <DrawerDialogTitle>
//             {!data ? "Add Variant" : "Edit Variant"}
//           </DrawerDialogTitle>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(handle)} className="grid gap-8">
//               <div className="grid">
//                 <FormInput name="unit" label="Unit" placeholder="500 ml" />
//                 <FormInput
//                   name="price"
//                   label="Price"
//                   placeholder="0"
//                   type="number"
//                   min={0}
//                 />
//               </div>
//               <DrawerDialogFooter>
//                 <DrawerDialogClose />
//                 <FormButton>Save Changes</FormButton>
//               </DrawerDialogFooter>
//             </form>
//           </Form>
//         </DrawerDialogHeader>
//       </DrawerDialogSwitcher>
//     </>
//   );
// }

export function VariantForm() {
  const label = "Variants";
  const name = "variants";
  const form = useFormContext();
  const watch = form.watch(name);
  const arr = useFieldArray({
    name,
    control: form.control,
    keyName: "kid",
  });

  // Add ref to track if we've already initialized
  const initializedRef = useRef(false);

  // Add default variant once if empty
  useEffect(() => {
    if (!arr.fields.length && !initializedRef.current) {
      arr.prepend({
        unit: "Untitled",
        price: 0,
        id: crypto.randomUUID(),
        images: [],
      });
      initializedRef.current = true;
    }
  }, [arr]);

  // Keep track of the currently open accordion item
  const [openItem, setOpenItem] = useState<string | undefined>(
    arr.fields[0]?.kid
  );

  // Sync openItem with list changes
  useEffect(() => {
    if (arr.fields.length > 0) {
      // If current openItem no longer exists, open the first one
      const exists = arr.fields.some((f) => f.kid === openItem);
      if (!exists) {
        setOpenItem(arr.fields[0].kid);
      }
    } else {
      setOpenItem(undefined);
    }
  }, [arr.fields, openItem]);

  return (
    <div className="my-2 border rounded-lg">
      <div className="flex justify-between p-4 bg-accent/80">
        <FormLabel>{label}</FormLabel>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() =>
            arr.prepend({
              unit: "Untitled",
              price: 0,
              id: crypto.randomUUID(),
              images: [],
            })
          }
        >
          Add New
        </Button>
      </div>

      <Accordion
        type="single"
        value={openItem}
        onValueChange={(val) => setOpenItem(val)}
        collapsible={false} // prevent closing all, but allow switching
      >
        {arr.fields.map((m, i) => (
          <AccordionItem
            key={m.kid}
            value={m.kid}
            className="hover:bg-accent/30 data-[state=open]:bg-accent/20 data-[state=open]:border"
          >
            <AccordionTrigger className="data-[state=open]:border-b">
              <div className="flex gap-2 items-center w-full">
                <div className="text-start flex gap-2 flex-1 px-4">
                  <p>{watch?.[i]?.unit || "Untitled"}</p>
                  <ArrowRight />
                  <p className="text-muted-foreground">
                    {formatAmount("INR", watch?.[i]?.price || 0)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent toggle when deleting
                    arr.remove(i);
                  }}
                  disabled={arr.fields.length === 1}
                >
                  <Trash />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <FormInput
                name={`${name}.${i}.unit`}
                label="Unit"
                placeholder="Variant title"
              />
              <FormInput
                name={`${name}.${i}.price`}
                label="Selling Price"
                type="number"
                placeholder="0"
                min={0}
                prefixEl={<span className="mr-1">₹</span>}
                required
              />
              <FormInput
                name={`${name}.${i}.maxPrice`}
                label="Max Price"
                type="number"
                placeholder="0"
                min={0}
                prefixEl={<span className="mr-1">₹</span>}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
