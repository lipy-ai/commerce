import { useFieldArray, useFormContext } from "react-hook-form";
import { SingleImage } from "./single-image";
import React from "react";
import { FormField } from "./form";
import type { FormElement, ProductImage } from "../forms/types";

export default function ProductImage(props: ProductImage) {
  const form = useFormContext();

  const arr = useFieldArray({
    control: form.control,
    name: props.name,
    keyName: "fid",
  });

  return (
    <div className="grid grid-cols-5 gap-4">
      {arr.fields.map((m, i) => (
        <React.Fragment key={m.fid}>
          <FormField
            control={form.control}
            name={`${props.name}.${i}.url`}
            render={({ field }) => (
              <SingleImage
                fileType={"product"}
                {...field}
                className="size-full"
              />
            )}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
