import { formatAmount } from "@lipy/lib/utils/intl";
import {
	DrawerDialogClose,
	DrawerDialogDescription,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import {
	FormButton,
	FormImage,
	FormInput,
	FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
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
import { createFileRoute } from "@tanstack/react-router";
import { PenLine } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
export const Route = createFileRoute("/(loggedIn)/product/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<DashboardHeader title="Edit Product" />
			<div className="grid lg:grid-cols-3 p-4 lg:p-8 gap-4 lg:gap-8">
				<div className="lg:col-span-2">
					<BasicProductDetails />
				</div>
				<div className="">
					<Variations />
				</div>
			</div>
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
export function BasicProductDetails() {
	const [open, setOpen] = useState(false);

	// const [showMore, setShowMore] = useState(!isMobile);

	const onSubmit = async (body: any) => {
		console.log(body);
		// await mutation.mutateAsync({ body }).then((r) => {
		//   // r.
		// })
	};

	const form = useForm({
		// resolver: zodResolver(),
		defaultValues: {},
	});

	const mrp = 300;
	const sp = 100;

	return (
		<div className="space-y-8">
			<Card className="">
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
					<CardAction>
						<Button
							onClick={() => setOpen(true)}
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
								src="https://media.istockphoto.com/id/471720606/photo/fresh-green-pea-pods-and-seeds-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=LqY-JK30etpiCY-nLSl2Y0vesw4eCF325Fz8_YQPCE8="
								alt=""
								className="size-24 aspect-square object-cover bg-accent border rounded"
							/>
							<Badge variant={"outline"} className="absolute -top-1 -right-1">
								5+
							</Badge>
						</div>
						<div className="flex justify-between w-full">
							<div>
								<p className="text-base">Green Peas</p>
								<p className="text-sm text-muted-foreground">Sprouts & Cuts</p>

								<p className="text-sm text-muted-foreground">2 Pieces</p>
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

					<div className="grid grid-cols-[140px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
						<Label>Brand</Label>
						<p>Fresh Foods</p>
						<Label>Health Benefits</Label>
						<p>Fiber & Protein Rich</p>
						<Label>Shelf Life</Label>
						<p>3 days</p>
						<Label>Description</Label>

						<p>
							Make everyday cooking simpler with these Peeled Green Peas. Just
							stock your fridge with these green pearls and use them according
							to your convenience. Simply add a handful to your dishes to add
							more character.
						</p>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent>
					<div className="grid grid-cols-[140px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
						<Label>Disclaimer</Label>
						<p>
							All images are for representational purposes only. It is advised
							that you read the batch and manufacturing details, directions for
							use, allergen information, health and nutritional claims (wherever
							applicable), and other details mentioned on the label before
							consuming the product. For combo items, individual prices can be
							viewed on the page.
						</p>
					</div>
				</CardContent>
			</Card>
			<DrawerDialogSwitcher className="" open={open} onOpenChange={setOpen}>
				<DrawerDialogHeader>
					<DrawerDialogTitle>Basic Information</DrawerDialogTitle>
					<DrawerDialogDescription>Basic Information</DrawerDialogDescription>
				</DrawerDialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
						<div className="grid">
							<FormInput
								name="title"
								label="Title"
								placeholder="Product Title"
							/>
							<FormInput
								name="category"
								label="Category"
								placeholder="Electronics"
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
							<FormInput
								name="unit"
								label="Unit"
								placeholder=""
								type="number"
								min={0}
								className="col-span-6"
							/>
							<FormTextarea
								name="summary"
								label="Summary"
								placeholder="Brief summary about this product..."
							/>
							<FormItem>
								<FormLabel>Images</FormLabel>

								<div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
									{[...Array(6)].map((m) => (
										<FormImage
											key={m}
											name="thumbnail"
											wrapperClassName="size-full"
										/>
									))}
								</div>
							</FormItem>
							{/* <FormInput
								label="Price"
								name="price"
								type="number"
								placeholder="0.00"
								className="col-span-6"
								prefixEl={<span>₹</span>}
							/>
							<FormInput
								name="stock_quantity"
								label="Stock Quantity"
								placeholder=""
								type="number"
								min={0}
								className="col-span-6"
							/>
							<FormInput
								name="sku"
								label="SKU"
								placeholder=""
								className="col-span-6 md:col-span-3"
							/>

							<FormInput
								name="brand"
								label="Brand"
								placeholder="Samsung"
								className="col-span-6 md:col-span-3"
							/>
							<FormInput
								name="model_id"
								label="Model ID"
								placeholder="Samsung"
								className="col-span-6 md:col-span-3"
							/> */}
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
