import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@lipy/lib/providers/auth";
import { FormButton, FormInput } from "@lipy/web-ui/components/forms/elements";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { Form } from "@lipy/web-ui/components/ui/form";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ShopCreateForm = () => {
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
		// const { data } = await authClient.organization.checkSlug({
		// 		slug: handle,
		// 	});

		const { data: orgData, error: orgError } =
			await authClient.organization.create({
				name: values.shopName,
				slug: values.handle,
			});

		if (orgError) {
			toast.error(orgError.message);
			return;
		}

		const { error } = await authClient.organization.setActive({
			organizationId: orgData?.id,
		});

		if (!error) {
			toast.success("Organization created successfully");
		}
	};

	return (
		<div className="bg-primary min-h-screen py-20 px-4 lg:p-20">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 lg:p-4 max-w-screen-sm mx-auto"
				>
					<Card className="rounded-4xl">
						<CardContent className="p-6 lg:p-12 space-y-8">
							<CardHeader className="space-y-6">
								<Link to="/">
									<img
										src="/logo/logo.png"
										alt="lipy-img"
										width={100}
										height={100}
										className="object-cover rounded-md"
									/>
								</Link>
								<CardTitle className="text-xl lg:text-3xl font-semibold">
									Fill business details{" "}
								</CardTitle>
							</CardHeader>
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
									// suffixEl={
									// 	checkingHandle ? (
									// 		<Loader className="animate-spin h-5 w-5" />
									// 	) : isHandleAvailable === true ? (
									// 		<Check className="text-emerald-500 h-5 w-5" />
									// 	) : null
									// }
								/>
							</div>
							<div className="w-full">
								<FormButton
									className="w-full lg:text-xl"
									disabled={
										form.formState.isSubmitting ||
										!form.formState.isValid ||
										!form.formState.isDirty
									}
								>
								Submit
								</FormButton>
							</div>
						</CardContent>
					</Card>
				</form>
			</Form>
		</div>
	);
};
