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

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";

import { Form } from "@lipy/web-ui/components/ui/form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
export const Route = createFileRoute("/(loggedIn)/product/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<DashboardHeader title="Edit Product">
				{/* {!isMobile && (
					<>
						<Button size={"icon"} variant={"outline"} type="button">
							<ExternalLink />
						</Button>
						<Button size={"icon"} variant={"outline"} type="button">
							<Share2 />
						</Button>
						<Button
							size={"icon"}
							variant={"outline"}
							onClick={() => console.log("gi")}
							type="button"
						>
							<Trash />
						</Button>
					</>
				)}
				{saveBtn} */}
			</DashboardHeader>
			<div className="p-4 lg:p-8">
				<BasicProductDetails />
			</div>
		</>
	);
}

export function BasicProductDetails() {
	const [open, onOpenChange] = useState(false);

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

	return (
		<div>
			<Card className="">
				<CardHeader>
					<CardTitle>Product Details</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex gap-4">
						<img
							src="https://media.istockphoto.com/id/471720606/photo/fresh-green-pea-pods-and-seeds-isolated-on-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=LqY-JK30etpiCY-nLSl2Y0vesw4eCF325Fz8_YQPCE8="
							alt=""
							className="size-24 aspect-square object-cover bg-accent border rounded"
						/>
						<CardTitle>Green Peas</CardTitle>
					</div>
				</CardContent>
			</Card>
			<DrawerDialogSwitcher
				className="sm:max-w-2xl"
				open={open}
				onOpenChange={onOpenChange}
			>
				<DrawerDialogHeader>
					<DrawerDialogTitle>Basic Information</DrawerDialogTitle>
					<DrawerDialogDescription>Basic Information</DrawerDialogDescription>
				</DrawerDialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="">
						<div className="space-y-8">
							<FormImage name="thumbnail" wrapperClassName="size-20" />
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
							<FormTextarea
								name="summary"
								label="Summary"
								placeholder="Brief summary about this product..."
							/>
							<FormInput
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
