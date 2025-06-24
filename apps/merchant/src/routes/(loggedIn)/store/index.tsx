import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import {
	apiQueryOptions,
	useAPIMutation,
	useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import type { addressSchema } from "@lipy/server/routes/address";
import {
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
import VerticalListSkeleton from "@lipy/web-ui/components/layouts/skeletons/verticalListSkeleton";
import GoogleMaps from "@lipy/web-ui/components/maps/googleMap";
import { Form } from "@lipy/web-ui/components/ui/form";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
export const Route = createFileRoute("/(loggedIn)/store/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [isOpenMap, setIsOpenMap] = useState(false);

	const { data, isLoading } = useAPIQuery(
		apiClient.v1.merchant.store,
		"$get",
		{},
	);

	const queryClient = useQueryClient();

	const form = useForm({
		defaultValues: {
			image: "",
			name: "",
			handle: "",
			description: "",
			email: "",
			phone: "",
			address: {},
		},
	});

	// Set store address when user selects it from GoogleMaps
	const handleStoreAddress = (address: z.infer<typeof addressSchema>) => {
		form.setValue("address", address, {
			shouldValidate: true,
			shouldDirty: true,
		});
		setIsOpenMap(false);
	};

	// Update form when API data loads
	useEffect(() => {
		if (data) {
			form.reset({
				image: data.image || "",
				name: data.name || "",
				handle: data.handle || "",
				description: data.description || "",
				email: data.email || "",
				phone: data.phone || "",
				address: data.address || {},
			});
		}
	}, [data, form.reset]);

	const updateMutation = useAPIMutation(apiClient.v1.merchant.store, "$patch", {
		form,
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: apiQueryOptions(apiClient.v1.merchant.store, "$get", {})
					.queryKey,
			});
			toast.success("Details updated");
		},
	});

	const onSubmit = async (json: any) => {
		await updateMutation.mutateAsync({ json });
	};

	if (isLoading) {
		return (
			<div>
				<DashboardHeader />
				<div className="p-4 lg:p-8 max-w-4xl">
					<VerticalListSkeleton count={8} />
				</div>
			</div>
		);
	}

	return (
		<Form {...form}>
			<DashboardHeader title="My Store" />

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 p-4 lg:p-8 max-w-4xl mb-28"
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
							<FormInput
								name="name"
								label="Name"
								placeholder="Flower Mart"
								required
							/>
							<FormInput
								name="handle"
								label="Handle"
								prefixEl={`${env.WEB_URL}/@`}
								prefixClassName="pl-4"
								inputClassName="-ml-4"
								required
							/>
							<FormTextarea
								name="description"
								label="Bio"
								placeholder="Tell us about your shop..."
							/>

							<div className="grid lg:grid-cols-2 lg:gap-4">
								<FormInput name="email" label="Email" />
								<FormInput name="phone" label="Phone Number" />
							</div>

							<FormTextarea
								name="address.line1"
								label="Address"
								className="cursor-pointer hover:bg-accent"
								value={
									(form.watch("address") as { line1?: string })?.line1 || ""
								}
								onClick={() => setIsOpenMap(true)}
								readOnly
								required
							/>
						</div>

						<div className="p-4">
							<FormButton
								disabled={
									form.formState.isSubmitting ||
									!form.formState.isDirty ||
									!form.formState.isValid
								}
							>
								Save Changes
							</FormButton>
						</div>
					</div>
				</div>
			</form>

			<DrawerDialogSwitcher
				open={isOpenMap}
				onOpenChange={setIsOpenMap}
				className="p-0 lg:min-w-4xl"
			>
				<DrawerDialogHeader className="p-4 lg:-mb-8">
					<DrawerDialogTitle>Save your store address</DrawerDialogTitle>
				</DrawerDialogHeader>

				<GoogleMaps
					type="saveAddress"
					useCase="merchant"
					setStoreAddress={handleStoreAddress} // this updates the form
					center={{
						lat: (form.watch("address") as { lat: number })?.lat,
						lng: (form.watch("address") as { lng: number })?.lng,
					}}
				/>
			</DrawerDialogSwitcher>
		</Form>
	);
}
