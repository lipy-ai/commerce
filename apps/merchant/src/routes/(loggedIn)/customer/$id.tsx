import {
	FormImage,
	FormInput,
	FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Form } from "@lipy/web-ui/components/ui/form";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/(loggedIn)/customer/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useForm({
		// resolver: zodResolver(),
		defaultValues: {},
	});

	const onSubmit = async (body: any) => {
		console.log(body);
	};

	return (
		<Form {...form}>
			<DashboardHeader title="Customer Details" />

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 p-8 max-w-4xl"
			>
				<div className="space-y-4">
					<h1 className="text-lg font-medium flex gap-2 items-center">
						General Information
					</h1>
					<div className="">
						<FormImage
							name="image"
							label="Image"
							wrapperClassName="size-20 mb-4"
						/>
						<FormInput name="name" label="Name" placeholder="Flower Mart" />
						<FormInput name="phone" label="Phone" placeholder="Phone Number" />
						<FormInput name="email" label="Email" placeholder="Email" />
						<FormTextarea
							name="description"
							label="Description"
							placeholder="Tell us about your shop..."
						/>
					</div>
					<Button className="" disabled={!form.formState.isDirty}>
						Save Changes
					</Button>
				</div>
			</form>
		</Form>
	);
}
