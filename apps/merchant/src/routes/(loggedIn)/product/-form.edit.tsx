import {
	DrawerDialogClose,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Form, FormItem, FormLabel } from "@lipy/web-ui/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@lipy/lib/api";
import {
	apiQueryOptions,
	useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import {
	FormButton,
	FormImage,
	FormInput,
	FormSelect,
	FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import type { InferResponseType } from "hono";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Sortable,
	SortableContent,
	SortableItem,
	SortableItemHandle,
	SortableOverlay,
} from "@lipy/web-ui/components/ui/sortable";
import { GripVertical, Trash } from "lucide-react";
import { Fragment, type ReactNode, useState } from "react";
import {
	useFieldArray,
	useForm,
	useFormContext,
	useWatch,
} from "react-hook-form";

export default function FormEdit({
	type,
	data,
	children,
}: {
	data?: InferResponseType<
		(typeof apiClient.v1.merchant.product)[":id"]["$get"]
	>;
	type: "create" | "update";
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);

	const defaultValues = {
		title: data?.title || "",
		category: data?.category?.id || "",
		price: data?.price || 0,
		maxPrice: data?.maxPrice || 0,
		summary: data?.summary || "",
		images: data?.images || [],
		highlights: data?.highlights || [],
		information: data?.information || [],
	};

	const form = useForm({
		defaultValues,
	});
	const queryClient = useQueryClient();

	const mutation = useAPIMutation(
		apiClient.v1.merchant.product[":id"],
		"$patch",
	);

	const onSubmit = async (body: typeof defaultValues) => {
		if (!data?.id) return;
		await mutation.mutateAsync(
			{ param: { id: data.id }, json: body },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: apiQueryOptions(
							apiClient.v1.merchant.product[":id"],
							"$get",
							{ param: { id: data.id } },
						).queryKey,
					});
					setOpen(false);
				},
			},
		);
	};

	return (
		<>
			<DrawerDialogSwitcher
				className=""
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
						<div className="grid">
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
							<div className="grid grid-cols-2 gap-4">
								<FormInput
									label="Selling Price"
									name="price"
									type="number"
									placeholder="0.00"
									className="col-span-6"
									prefixEl={<span>₹</span>}
								/>
								<FormInput
									label="Max Retail Price (MRP)"
									name="maxPrice"
									type="number"
									placeholder="0.00"
									className="col-span-6"
									prefixEl={<span>₹</span>}
								/>
							</div>

							<FormTextarea
								name="summary"
								label="Summary"
								placeholder="Brief summary about this product..."
							/>
							<FormItem>
								<FormLabel>Images</FormLabel>

								<div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
									{[...Array(6)].map((m, i) => (
										<FormImage
											key={m}
											name={`images.${i}`}
											wrapperClassName="size-full"
										/>
									))}
								</div>
							</FormItem>
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
						arr.prepend({ label: "Untitled", value: "Untitled" });
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
														<p>{watch[i]?.label}</p>
														<p className="text-sm text-muted-foreground">
															{watch[i]?.value}
														</p>
													</div>
													<Button
														variant="secondary"
														size="icon-sm"
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
													name={`${name}.${i}.label`}
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
