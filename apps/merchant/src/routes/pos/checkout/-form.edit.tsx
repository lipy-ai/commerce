import { formatAmount } from "@lipy/lib/utils/intl";
import { FormEditableInput } from "@lipy/web-ui/components/forms/elements";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardContent } from "@lipy/web-ui/components/ui/card";
import { Form } from "@lipy/web-ui/components/ui/form";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

export default function POSFormEdit() {
  const defaultValues = {
    items: [
      {
        title: "Title",
        price: 1,
        unit: "1 Kg",
      },
    ],
    taxes: [
      {
        title: "GST",
        price: 100,
      },
    ],
    discounts: [
      {
        title: "Coupon",
        price: 100,
      },
    ],
  };
  const form = useForm({ defaultValues });
  const itemsArr = useFieldArray({
    name: "items",
    keyName: "kid",
    control: form.control,
  });
  const taxesArr = useFieldArray({
    name: "taxes",
    keyName: "kid",
    control: form.control,
  });
  const discountArr = useFieldArray({
    name: "discounts",
    keyName: "kid",
    control: form.control,
  });

  return (
    <div>
      <Form {...form}>
        <form className="seprator">
          <Card className="">
            <CardContent className="space-y-4">
              {/* <Label>Items</Label> */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <Button
                    type="button"
                    size={"icon"}
                    variant={"secondary"}
                    className="ml-auto"
                    onClick={() =>
                      itemsArr.append({
                        title: "Untitled",
                        price: 100,
                        unit: "1 Kg",
                      })
                    }
                  >
                    <Plus /> Add Items
                  </Button>{" "}
                </div>
                {itemsArr.fields.map((f, i) => (
                  <div className="flex gap-1" key={f.kid}>
                    <FormEditableInput
                      name={`items.${i}.title`}
                      wrapperClassName="flex-1"
                    />
                    <FormEditableInput
                      name={`items.${i}.unit`}
                      wrapperClassName="w-1/4"
                    />
                    <FormEditableInput
                      name={`items.${i}.price`}
                      wrapperClassName="w-1/4"
                    />
                    <Button
                      type="button"
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => itemsArr.remove(i)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <Button
                    type="button"
                    size={"sm"}
                    variant={"link"}
                    className="px-0"
                    onClick={() =>
                      taxesArr.append({
                        title: "Untitled",
                        price: 100,
                      })
                    }
                  >
                    <Plus />
                    Add Taxes
                  </Button>
                </div>
                {taxesArr.fields.map((f, i) => (
                  <div className="flex gap-1" key={f.kid}>
                    <FormEditableInput
                      name={`taxes.${i}.title`}
                      wrapperClassName="flex-1"
                    />
                    <FormEditableInput
                      name={`taxes.${i}.price`}
                      wrapperClassName="w-1/4"
                    />

                    <Button
                      type="button"
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => itemsArr.remove(i)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="text-lg font-semibold flex-1">Discounts</p>{" "}
                  <Button
                    type="button"
                    size={"icon"}
                    variant={"secondary"}
                    className="ml-auto"
                    onClick={() =>
                      discountArr.append({
                        title: "Untitled",
                        price: 100,
                      })
                    }
                  >
                    <Plus />
                  </Button>
                </div>
                {discountArr.fields.map((f, i) => (
                  <div className="flex gap-1" key={f.kid}>
                    <FormEditableInput
                      name={`taxes.${i}.title`}
                      wrapperClassName="flex-1"
                    />
                    <FormEditableInput
                      name={`taxes.${i}.price`}
                      wrapperClassName="w-1/4"
                    />

                    <Button
                      type="button"
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => itemsArr.remove(i)}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between gap-2">
                <p className="flex-1">Item Total</p>{" "}
                <p className="">{formatAmount("INR", 300)}</p>
              </div>
              <div className="flex justify-between gap-2">
                <p className="flex-1">Total Taxes</p>{" "}
                <p className="">{formatAmount("INR", 300)}</p>
              </div>
              <div className="flex justify-between gap-2">
                <p className="flex-1">Total Discount</p>{" "}
                <p className="">{formatAmount("INR", 300)}</p>
              </div>
              <div className="flex justify-between gap-2">
                <p className="flex-1">Total</p>{" "}
                <p className="text-lg font-bold">{formatAmount("INR", 300)}</p>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
