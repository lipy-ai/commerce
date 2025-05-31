"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@lipy/web-ui/lib/utils";
import { Label } from "../ui/label";

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Root
			className={cn("grid gap-3", className)}
			{...props}
			ref={ref}
		/>
	);
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				"aspect-square size-4 rounded-full border border-input shadow-sm shadow-black/5 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex items-center justify-center text-current">
				<svg
					width="6"
					height="6"
					viewBox="0 0 6 6"
					fill="currentcolor"
					xmlns="http://www.w3.org/2000/svg"
					aria-label="Radio selection indicator"
					role="img"
				>
					<title>Radio selection indicator</title>
					<circle cx="3" cy="3" r="3" />
				</svg>
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

function CustomRadioGroup({
	items,
	...props
}: Omit<
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
	"onChange"
> & {
	items: { value: string; label: string }[];
	onChange?: (value: string) => void;
}) {
	const id = React.useId();

	return (
		<fieldset className="space-y-4 max-w-[400px]">
			{/* props go to RadioGroup, not each item */}
			<RadioGroup
				className="flex flex-wrap gap-2"
				value={props.value}
				onValueChange={(value: string) => props.onChange?.(value)}
				name={props.name}
			>
				{items.map((item) => (
					<div
						key={`${id}-${item.value}`}
						className="relative flex flex-col items-start gap-4 rounded-lg border border-input p-3 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring"
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem
								id={`${id}-${item.value}`}
								value={item.value}
								className="after:absolute after:inset-0"
							/>
							<Label htmlFor={`${id}-${item.value}`}>{item.label}</Label>
						</div>
					</div>
				))}
			</RadioGroup>
		</fieldset>
	);
}

export { RadioGroup, RadioGroupItem, CustomRadioGroup };
