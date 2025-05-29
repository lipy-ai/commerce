import { FormImage, FormInput } from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Form } from "@lipy/web-ui/components/ui/form";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/(loggedIn)/account/profile")({
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
			<DashboardHeader title="My Profile" />

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 lg:p-8 max-w-4xl"
			>
				<div className="grid divide-y lg:gap-4">
					<div className="bg-background lg:border">
						<h1 className="text-lg font-medium px-4 p-4 flex gap-2 items-center">
							General Information
						</h1>
						<div className="p-4">
							<FormImage
								name="name"
								label="Name"
								wrapperClassName="size-20 mb-4"
							/>
							<FormInput name="handle" label="Handle" placeholder="John Doe" />
							<FormInput
								type="email"
								name="email"
								label="Email"
								placeholder="jhon@example.com"
							/>
						</div>
						<div className="p-4">
							<Button className="" disabled={!form.formState.isDirty}>
								Save Changes
							</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
