import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/queryClient";
import {
	FormButton,
	FormImage,
	FormInput,
	FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Form } from "@lipy/web-ui/components/ui/form";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/(loggedIn)/store/")({
	component: RouteComponent,
});

function RouteComponent() {
	const defaultValues = {
		image: "",
		name: "",
		handle: "",
		description: "",
		email: "",
		phone: "",
	};
	const form = useForm({
		defaultValues,
	});
	const updateMutation = useAPIMutation(apiClient.v1.merchant.store, "$patch", {
		onSuccess() {
			// queryClient.invalidateQueries({
			// 	queryKey: apiQueryOptions(apiClient.v1.address, "$get", {}).queryKey,
			// });
		},
	});

	const onSubmit = async (json: typeof defaultValues) => {
		toast.promise(updateMutation.mutateAsync({ json }), {
			error: "Failed to update store details.",
		});
	};

	return (
		<Form {...form}>
			<DashboardHeader title="My Store" />

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 p-4 lg:p-8 max-w-4xl"
			>
				<div className="grid divide-y lg:gap-4">
					<div className="bg-background">
						<h1 className="text-lg font-medium px-4 p-4 flex gap-2 items-center">
							General Information
						</h1>
						<div className="p-4">
							<FormImage
								name="image"
								label="Image"
								wrapperClassName="size-20 mb-4"
							/>
							<FormInput name="name" label="Name" placeholder="Flower Mart" />
							<FormInput
								name="handle"
								label="Handle"
								prefixEl={`${env.WEB_URL}/@`}
								prefixClassName="px-0.5 pl-2"
								placeholder="flowermart"
							/>
							<FormTextarea
								name="description"
								label="Bio"
								placeholder="Tell us about your shop..."
							/>

							<FormInput name="email" label="Email" />
							<FormInput name="phone" label="Phone Number" />
						</div>
						<div className="p-4">
							<FormButton>Save Changes</FormButton>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
