import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { ProductImage as Type } from "../forms/types";
import { FormField } from "./form";
import { SingleImage } from "./single-image";

export default function ProductImage(props: Type) {
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
