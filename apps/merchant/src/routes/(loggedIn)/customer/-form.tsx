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
	FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import { Form } from "@lipy/web-ui/components/ui/form";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

export function CustomerForm({
	type,
	children,
}: { type: "create" | "update"; children: ReactNode }) {
	const form = useForm({
		// resolver: zodResolver(),
		defaultValues: {},
	});

	const onSubmit = async (body: any) => {
		console.log(body);
	};

	return (
		<Form {...form}>
			<DrawerDialogSwitcher trigger={children}>
				<DrawerDialogHeader>
					<DrawerDialogTitle>
						{type === "create" ? "Create Customer" : "Edit Customer"}
					</DrawerDialogTitle>
				</DrawerDialogHeader>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 max-w-4xl"
				>
					<div className="space-y-4">
						<div className="">
							<FormImage
								name="image"
								label="Image"
								wrapperClassName="size-20 mb-4"
							/>
							<FormInput name="name" label="Name" placeholder="Flower Mart" />
							<FormInput
								name="phone"
								label="Phone"
								placeholder="Phone Number"
							/>
							<FormInput name="email" label="Email" placeholder="Email" />
							<FormTextarea
								name="description"
								label="Description"
								placeholder="Tell us about your shop..."
							/>
						</div>
						<DrawerDialogFooter>
							<DrawerDialogClose />
							<FormButton>Save Changes</FormButton>
						</DrawerDialogFooter>
					</div>
				</form>
			</DrawerDialogSwitcher>
		</Form>
	);
}
