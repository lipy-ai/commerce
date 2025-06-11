import { authClient } from "@lipy/lib/providers/auth";
import {
	FormButton,
	FormImage,
	FormInput,
} from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Form } from "@lipy/web-ui/components/ui/form";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/(loggedIn)/account/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = authClient.useSession();

	const defaultValues = {
		image: data?.user.image,
		name: data?.user.name,
		email: data?.user.email,
	};

	const form = useForm({
		// resolver: zodResolver(),
		defaultValues,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		data?.user && form.reset({ ...data?.user });
	}, [data]);

	const onSubmit = async (data: typeof defaultValues) => {
		toast.promise(
			authClient.updateUser({ name: data.name }).then((r) => {
				if (r.error) throw r.error;
				return r.data;
			}),
			{
				error: "Failed to update profile.",
			},
		);
	};

	return (
		<Form {...form}>
			<DashboardHeader title="My Profile" />

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 lg:p-4 max-w-4xl"
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
								alt="Profile image"
								referrerPolicy="no-referrer"
							/>
							<FormInput name="name" label="Name" placeholder="John Doe" />
							<FormInput
								type="email"
								name="email"
								label="Email"
								disabled
								placeholder="jhon@example.com"
							/>
						</div>
						<div className="p-4">
							<FormButton className="" disabled={!form.formState.isDirty}>
								Save Changes
							</FormButton>
						</div>
					</div>
				</div>
			</form>

			{/* <div className="px-4 lg:px-8 max-w-4xl ">
				<Separator className="my-8" />
			</div> */}
			{/* <div className="max-w-4xl lg:p-8 ">
				<div className="p-4 grid gap-4 lg:flex bg-destructive/10 border ">
					<div className="flex-1">
						<Label className="text-md font-medium">Delete Account</Label>
						<p className="font-light">
							This action is irreversible and will permanently deactivate your
							account.
						</p>
					</div>
					<div>
						<Button variant={"destructive"}>
							<Trash />
							Delete Account
						</Button>
					</div>
				</div>
			</div> */}
		</Form>
	);
}
