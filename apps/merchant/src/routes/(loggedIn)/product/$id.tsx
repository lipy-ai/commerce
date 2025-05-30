import {
	FormImage,
	FormInput,
	FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	AnnotatedLayout,
	AnnotatedSection,
} from "@lipy/web-ui/components/ui/annotated";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Form } from "@lipy/web-ui/components/ui/form";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Share2, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
export const Route = createFileRoute("/(loggedIn)/product/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const onSubmit = async (body: any) => {
		console.log(body);
		// await mutation.mutateAsync({ body }).then((r) => {
		//   // r.
		// })
	};
	const { isMobile } = useViewport();

	const form = useForm({
		// resolver: zodResolver(),
		defaultValues: {},
	});

	const saveBtn = (
		<Button size={isMobile ? "sm" : "default"}>
			{isMobile ? "Save Changes" : "Save Changes"}
		</Button>
	);

	return (
		<Form {...form}>
			<DashboardHeader title="Edit Product">
				{!isMobile && (
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
				{saveBtn}
			</DashboardHeader>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="">
					<div>
						<AnnotatedLayout>
							<AnnotatedSection
								title="General Information"
								desc="Basic information about the product"
							>
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
							</AnnotatedSection>
							<AnnotatedSection
								title="Inventory Information"
								desc="Inventory information about the product"
							>
								<div className="grid grid-cols-12 gap-x-8">
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
							</AnnotatedSection>

							<AnnotatedSection title="Product Images">
								<FormImage name="thumbnail" wrapperClassName="size-20" />
							</AnnotatedSection>
						</AnnotatedLayout>
					</div>
				</div>
			</form>
		</Form>
	);
}
