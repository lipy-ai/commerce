import { apiClient } from "@lipy/lib/api";
import { formatAmount } from "@lipy/lib/utils/intl";
import {
	apiQueryOptions,
	useAPIMutation,
	useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import {
	DrawerDialogClose,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import {
	FormButton,
	FormImage,
	FormInput,
	FormSelect,
	FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@lipy/web-ui/components/ui/accordion";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Form, FormItem, FormLabel } from "@lipy/web-ui/components/ui/form";
import { Label } from "@lipy/web-ui/components/ui/label";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
import {
	Sortable,
	SortableContent,
	SortableItem,
	SortableItemHandle,
	SortableOverlay,
} from "@lipy/web-ui/components/ui/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { InferResponseType } from "hono/client";
import { GripVertical, PenLine } from "lucide-react";
import { Fragment, useState } from "react";
import {
	type DefaultValues,
	type FieldValues,
	type UseFormReturn,
	useFieldArray,
	useForm,
} from "react-hook-form";

export const Route = createFileRoute("/(loggedIn)/product/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const product = useAPIQuery(apiClient.v1.merchant.product[":id"], "$get", {
		param: { id },
	});
	return (
		<>
			{product.isLoading ? (
				<Skeleton className="flex-1 m-8" />
			) : (
				<>
					<DashboardHeader title={product.data?.title || ""} />
					<div className="grid lg:grid-cols-3 p-4 lg:p-8 gap-4 lg:gap-8">
						<div className="lg:col-span-2">
							<BasicProductDetails data={product.data} />
						</div>
						<div className="">
							<Variations />
						</div>
					</div>
				</>
			)}
		</>
	);
}

export function Variations() {
	const [open, setOpen] = useState(false);

	const form = useForm({
		// resolver: zodResolver(),
		defaultValues: {},
	});
	const onSubmit = async (body: any) => {
		console.log(body);
		// await mutation.mutateAsync({ body }).then((r) => {
		//   // r.
		// })
	};
	return (
		<div>
			<Card className="">
				<CardHeader>
					<CardTitle>Variants</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="divide-y divide-dashed">
						{[...Array(3)].map((_k, i) => (
							<div
								onClick={() => setOpen(true)}
								key={i}
								className="cursor-pointer hover:bg-accent flex gap-4 p-4"
							>
								<img
									src="https://media.istockphoto.com/id/471720606/photo/fresh-green-pea-pods-and-seeds-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=LqY-JK30etpiCY-nLSl2Y0vesw4eCF325Fz8_YQPCE8="
									alt=""
									className="size-12 aspect-square object-cover bg-accent border rounded"
								/>
								<div>
									<CardTitle>{(i + 1) * 2} x Green Sprouts</CardTitle>
									<CardDescription>${(i + 1) * 10}</CardDescription>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
			<DrawerDialogSwitcher className="" open={open} onOpenChange={setOpen}>
				<DrawerDialogHeader>
					<DrawerDialogTitle>Variant Information</DrawerDialogTitle>
				</DrawerDialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="">
						<div className="space-y-8">
							<FormInput
								name="unit"
								label="Unit"
								placeholder=""
								type="number"
								min={0}
								className="col-span-6"
							/>
							<FormInput
								label="Price"
								name="price"
								type="number"
								placeholder="0.00"
								className="col-span-6"
								prefixEl={<span>₹</span>}
							/>
							<FormSelect
								label="Product"
								placeholder="Select"
								name="category"
								type="products"
							/>
						</div>
						<DrawerDialogFooter>
							<DrawerDialogClose />
							<FormButton>Save Changes</FormButton>
						</DrawerDialogFooter>
					</form>
				</Form>
			</DrawerDialogSwitcher>
		</div>
	);
}

function useProductFormHook<T extends FieldValues>({
	data,
	defaultValues,
	setOpen,
}: {
	data: any;
	defaultValues: DefaultValues<T>;
	setOpen: (v: string) => void;
}): {
	form: UseFormReturn<T>;
	onSubmit: (body: T) => Promise<void>;
} {
	const form = useForm<T>({
		defaultValues,
	});
	const queryClient = useQueryClient();

	const mutation = useAPIMutation(
		apiClient.v1.merchant.product[":id"],
		"$patch",
	);

	const onSubmit = async (body: T) => {
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
					setOpen("");
				},
			},
		);
	};
	return { form, onSubmit };
}

export function BasicProductDetails({
	data,
}: {
	data?: InferResponseType<
		(typeof apiClient.v1.merchant.product)[":id"]["$get"]
	>;
}) {
	const [open, setOpen] = useState("");

	const basicForm = useProductFormHook({
		data,
		defaultValues: {
			title: data?.title || "",
			category: data?.category?.id || "",
			price: data?.price || 0,
			maxPrice: data?.maxPrice || 0,
			summary: data?.summary || "",
			images: data?.images || [],
		},
		setOpen,
	});

	const highlights = useProductFormHook({
		data,
		defaultValues: { highlights: data?.highlights || [] },
		setOpen,
	});

	const highlightsArr = useFieldArray({
		name: "highlights",
		control: highlights.form.control,
		keyName: "kid",
	});

	// const information = useProductFormHook({
	// 	data,
	// 	defaultValues: { information: data?.information || [] },
	// 	setOpen,
	// });

	// const informationArr = useFieldArray({
	// 	name: "information",
	// 	control: information.form.control,
	// 	keyName: "kid",
	// });

	const mrp = data?.maxPrice || 0;
	const sp = data?.price || 0;

	return (
		<div className="space-y-8">
			<Card className="">
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
					<CardAction>
						<Button
							onClick={() => setOpen("general")}
							variant={"outline"}
							size={"sm"}
						>
							<PenLine /> Edit
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent className="space-y-8">
					<div className="flex gap-4">
						<div className="relative">
							<img
								src={data?.thumbnail || ""}
								alt={data?.title || "Untitled"}
								className="size-24 aspect-square object-cover bg-accent border rounded"
							/>
							{(data?.images?.length || 0) > 0 && (
								<Badge variant={"outline"} className="absolute -top-1 -right-1">
									{data?.images?.length}+
								</Badge>
							)}
						</div>
						<div className="flex justify-between w-full">
							<div>
								<p className="text-lg">{data?.title}</p>
								<p className="text-sm text-muted-foreground">
									{data?.category.title}
								</p>

								{/* <p className="text-sm text-muted-foreground">{data.summary}</p> */}
							</div>
							<div>
								<Badge variant={"success"}>
									{formatAmount("inr", mrp - sp)} Off
								</Badge>
								<p className="text-2xl font-medium">
									{formatAmount("inr", sp)}{" "}
									<span className="line-through text-muted-foreground text-base">
										{formatAmount("inr", mrp)}
									</span>
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Highlights</CardTitle>
					<CardAction>
						<Button
							onClick={() => setOpen("highlights")}
							variant={"outline"}
							size={"sm"}
						>
							<PenLine />
							Edit
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					{data?.highlights && (
						<div className="grid grid-cols-[140px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
							{data?.highlights.map((d, i) => (
								<Fragment key={i}>
									<Label>{d.label}</Label>
									<p>{d.value}</p>
								</Fragment>
							))}
						</div>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>More Information</CardTitle>
					<CardAction>
						<Button
							onClick={() => setOpen("information")}
							variant={"outline"}
							size={"sm"}
						>
							<PenLine /> Edit
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					{data?.information && (
						<div className="grid grid-cols-[140px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
							{data?.information.map((d, i) => (
								<Fragment key={i}>
									<Label>{d.label}</Label>
									<p>{d.value}</p>
								</Fragment>
							))}
						</div>
					)}
				</CardContent>
			</Card>
			{open === "general" ? (
				<DrawerDialogSwitcher
					className=""
					open={!!open}
					onOpenChange={(o) => setOpen(o ? "general" : "")}
				>
					<DrawerDialogHeader>
						<DrawerDialogTitle>Basic Information</DrawerDialogTitle>
					</DrawerDialogHeader>
					<Form {...basicForm.form}>
						<form
							onSubmit={basicForm.form.handleSubmit(basicForm.onSubmit)}
							className="grid gap-8"
						>
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
							</div>
							<DrawerDialogFooter>
								<DrawerDialogClose />
								<FormButton>Save Changes</FormButton>
							</DrawerDialogFooter>
						</form>
					</Form>
				</DrawerDialogSwitcher>
			) : open === "highlights" ? (
				<DrawerDialogSwitcher
					className=""
					open={!!open}
					onOpenChange={(o) => setOpen(o ? "highlights" : "")}
				>
					<DrawerDialogHeader>
						<DrawerDialogTitle>Highlights</DrawerDialogTitle>
					</DrawerDialogHeader>
					<Sortable
						value={highlightsArr.fields}
						onValueChange={(v) => highlights.form.setValue("highlights", v)}
						getItemValue={(item) => item.kid}
					>
						<Form {...highlights.form}>
							<form onSubmit={basicForm.form.handleSubmit(basicForm.onSubmit)}>
								<SortableContent asChild>
									<Accordion type="single" collapsible className="mb-8">
										{highlightsArr.fields.map((f, i) => (
											<Fragment key={f.kid}>
												<SortableItem key={f.kid} value={f.kid} asChild>
													<AccordionItem
														value={f.kid}
														className="hover:bg-accent data-[state=open]:bg-accent/20 data-[state=open]:border"
													>
														<AccordionTrigger className="data-[state=open]:border-b">
															<div className="flex gap-2 items-center">
																<SortableItemHandle asChild>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="size-8"
																	>
																		<GripVertical className="h-4 w-4" />
																	</Button>
																</SortableItemHandle>
																<div className="text-start">
																	<p>{f.label}</p>
																	<p className="text-sm text-muted-foreground">
																		{f.value}
																	</p>
																</div>
															</div>
														</AccordionTrigger>
														<AccordionContent className="p-4">
															<FormInput
																name={`highlights.${i}.label`}
																placeholder="Highlight Key"
															/>
															<FormTextarea
																name={`highlights.${i}.content`}
																placeholder="Highlight Value"
															/>
														</AccordionContent>
													</AccordionItem>
												</SortableItem>
											</Fragment>
										))}
									</Accordion>
								</SortableContent>
								<SortableOverlay>
									<div className="size-full rounded-none bg-primary/10" />
								</SortableOverlay>
								<DrawerDialogFooter>
									<DrawerDialogClose />
									<FormButton>Save Changes</FormButton>
								</DrawerDialogFooter>
							</form>
						</Form>
					</Sortable>
				</DrawerDialogSwitcher>
			) : null}
		</div>
	);
}
