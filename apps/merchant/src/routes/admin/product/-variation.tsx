import type { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";

import {
	DrawerDialogClose,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { FormButton, FormInput } from "@lipy/web-ui/components/forms/elements";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Form, FormLabel } from "@lipy/web-ui/components/ui/form";
import type { InferResponseType } from "hono";
import { ArrowRight, Trash } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";

type Response = Pick<
	InferResponseType<
		(typeof apiClient.v1.admin.product)["$get"]
	>["items"][0]["variants"][0],
	"id" | "images" | "price" | "unit"
>[];

export default function ProductVariationForm({
	data,
	children,
}: {
	data: Response;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);

	const defaultValues: { items: Response } = {
		items: [],
	};

	const form = useForm<typeof defaultValues>({
		defaultValues,
	});

	const handle = async (d: typeof defaultValues) => {};

	return (
		<>
			<DrawerDialogSwitcher
				open={open}
				onOpenChange={setOpen}
				trigger={children}
			>
				<DrawerDialogHeader>
					<DrawerDialogTitle>Variants</DrawerDialogTitle>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handle)} className="grid gap-8">
							<DrawerDialogFooter>
								<DrawerDialogClose />
								<FormButton>Save Changes</FormButton>
							</DrawerDialogFooter>
						</form>
					</Form>
				</DrawerDialogHeader>
			</DrawerDialogSwitcher>
		</>
	);
}

export function VariantForm() {
	const label = "Variants";
	const name = "variants";
	const form = useFormContext();
	const arr = useFieldArray({
		name,
		control: form.control,
		keyName: "kid",
	});
	const watch = form.watch(name);

	return (
		<>
			<div className="mt-8">
				<div className="flex justify-between p-4 bg-accent/50">
					<FormLabel>{label}</FormLabel>

					<Button
						variant={"outline"}
						size={"sm"}
						type="button"
						onClick={() => {
							arr.prepend({
								unit: "Untitled",
								price: 0,
								id: crypto.randomUUID(),
								images: [],
							});
						}}
					>
						Add New
					</Button>
				</div>
				<Accordion type="single" collapsible>
					{arr.fields.map((m, i) => (
						<AccordionItem
							key={m.kid}
							value={m.kid}
							className="hover:bg-accent/50 data-[state=open]:bg-accent/20 data-[state=open]:border"
						>
							<AccordionTrigger className="data-[state=open]:border-b">
								<div className="flex gap-2 items-center w-full">
									<div className="text-start flex gap-2 flex-1 px-4">
										<p className="">{watch[i]?.unit}</p> <ArrowRight />
										<p className="text-muted-foreground">
											{formatAmount("INR", watch[i]?.price || 0)}
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
									name={`${name}.${i}.unit`}
									label="Unit"
									placeholder="500 ml"
								/>
								<FormInput
									name={`${name}.${i}.price`}
									label="Price"
									placeholder="0"
									type="number"
									min={0}
								/>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</>
	);
}
