import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@lipy/lib/providers/auth";
import { FormButton, FormInput } from "@lipy/web-ui/components/forms/elements";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@lipy/web-ui/components/ui/alert-dialog";

import { Form } from "@lipy/web-ui/components/ui/form";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/(loggedIn)/(miscellaneous)/newStore")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { data, refetch } = authClient.useSession();
	console.log("Session ", data);

	if (data?.session.activeOrganizationId) navigate({ to: "/" });
	const formSchema = z.object({
		shopName: z
			.string()
			.min(2, {
				message: "Shop name must be at least 2 characters long",
			})
			.max(100, {
				message: "Shop name must be at most 100 characters long",
			}),
		handle: z
			.string()
			.min(2, { message: "Handle must be at least 2 characters long" })
			.max(150, {
				message: "Handle must be at most 150 characters long",
			}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			shopName: "",
			handle: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const { data: org, error: orgError } = await authClient.organization.create(
			{
				name: values.shopName,
				slug: values.handle,
			},
		);

		if (orgError) {
			toast.error(orgError.message);
			return;
		}

		const { error } = await authClient.organization.setActive({
			organizationId: org.id,
		});

		if (!error) {
			refetch();
			navigate({ to: "/" });
			toast.success("Organization created successfully");
		}
	};

	return (
		<div className="bg-primary min-h-screen">
			<AlertDialog open={true}>
				<AlertDialogContent>
					<AlertDialogHeader className="space-y-12">
						<Link to="/">
							<img
								src="/logo/logo.png"
								alt="lipy-img"
								width={100}
								height={100}
								className="object-cover rounded-md"
							/>
						</Link>
						<AlertDialogTitle className="text-xl lg:text-2xl">
							Fill business details{" "}
						</AlertDialogTitle>
					</AlertDialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div>
								<FormInput
									name="shopName"
									label="Shop Name"
									placeholder="Lipy General Store"
									className="text-2xl lg:p-2"
									required
								/>
								<FormInput
									name="handle"
									label="Shop Handle"
									placeholder="lipy-general-store"
									className="text-2xl lg:p-2"
									required
								/>
							</div>
							<div className="w-full">
								<FormButton
									className="w-full lg:text-base"
									disabled={
										form.formState.isSubmitting ||
										!form.formState.isValid ||
										!form.formState.isDirty
									}
								>
									Submit
								</FormButton>
							</div>
						</form>
					</Form>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
