import { env } from "@envClient";
import { zodResolver } from "@hookform/resolvers/zod";
// @ts-nocheck
import { apiClient } from "@lipy/lib/api";
import { authClient } from "@lipy/lib/providers/auth";
import {
	apiQueryOptions,
	useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import { CustomRadioGroup } from "@lipy/web-ui/components/custom-ui/customRadioGroup";
import { DrawerDialogSwitcher } from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { InputWithAnimatedLabel } from "@lipy/web-ui/components/custom-ui/inputWithAnimatedLabel";
import { FormButton } from "@lipy/web-ui/components/forms/elements";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@lipy/web-ui/components/ui/form";
import { ScrollArea } from "@lipy/web-ui/components/ui/scroll-area";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useLocationStore } from "./utils/store";
const addressTypesItems = [
	{ value: "home", label: "Home" },
	{ value: "work", label: "Work" },
	{ value: "other", label: "Other" },
];

export function DetailedAddress({
	fullAddress,
	label,
	open,
	onOpenChange,
	isDeliveryAddress,
}: {
	fullAddress: any;
	label: "Edit" | "Add";
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	isDeliveryAddress?: boolean;
}) {
	const { data } = authClient.useSession();
	const queryClient = useQueryClient();
	const { setDeliveryLocation, deliveryLocation } = useLocationStore();

	const formSchema = z.object({
		building: z.string().min(2, "Please fill your detailed address"),
		addressType: z.enum(["home", "work", "other"]),
		receiverName: z.string().optional(),
		receiverPhone: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			building: fullAddress.metadata?.building || "",
			addressType: fullAddress.tag || "home",
			receiverName: fullAddress.name || data?.user?.name || "",
			receiverPhone: fullAddress.phone || "",
		},
	});

	const mutation = useAPIMutation(apiClient.v1.address, "$post", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueryOptions(apiClient.v1.address, "$get", {}).queryKey,
			});

			onOpenChange?.(false);
			window.location.href = `${env.WEB_URL}/account/addresses`;
		},
		onError: () => toast.error("Something went wrong while adding address"),
	});

	const editMutation = useAPIMutation(apiClient.v1.address[":id"], "$patch", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueryOptions(apiClient.v1.address, "$get", {}).queryKey,
			});
			onOpenChange?.(false);
		},
		onError: () => toast.error("Something went wrong while editing address"),
	});

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		const basePayload = {
			name: values.receiverName || fullAddress.name,
			country: fullAddress.country,
			tag: values.addressType,
			line2: "",
			city: fullAddress.city,
			state: fullAddress.state,
			postalCode: fullAddress.postalCode,
			phone: values.receiverPhone,
			lat: fullAddress.lat,
			lng: fullAddress.lng,
			line1: fullAddress.line1,
			metadata: {
				building: values.building,
			},
		};

		if (!isDeliveryAddress && label === "Add") {
			await mutation.mutateAsync({
				json: {
					...basePayload,
				},
			});
		} else if (!isDeliveryAddress && label === "Edit") {
			await editMutation.mutateAsync({
				param: { id: fullAddress.id },
				json: {
					...basePayload,
				},
			});
		}

		if (isDeliveryAddress) {
			setDeliveryLocation({
				...deliveryLocation,
				name: basePayload.name,
				tag: values.addressType,
				line1: fullAddress.line1,
				phone: basePayload.phone || "",
				metadata: {
					building: values.building,
				},
			});
			onOpenChange?.(false);
		}
	};

	return (
		<DrawerDialogSwitcher open={open} onOpenChange={onOpenChange}>
			<ScrollArea className="overflow-y-auto">
				<div className="p-4">
					<div className="flex items-center justify-between">
						<div className="font-semibold text-lg">Add address details</div>
					</div>
				</div>

				<Separator />

				<div className="p-4 mb-6">
					<div className="text-sm rounded-md border p-2 bg-accent font-medium">
						<p>{fullAddress?.line1}</p>
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-8 my-10 w-full"
						>
							<FormField
								control={form.control}
								name="building"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputWithAnimatedLabel
												title="Flat No. / House No. / Building Name *"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="addressType"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-muted-foreground font-semibold">
											Address type
										</FormLabel>
										<FormControl>
											<CustomRadioGroup {...field} items={addressTypesItems} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormLabel className="text-muted-foreground font-semibold">
								Receiver's Details
							</FormLabel>

							<FormField
								control={form.control}
								name="receiverName"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputWithAnimatedLabel
												title="Receiver's Name (optional)"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="receiverPhone"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<InputWithAnimatedLabel
												title="Receiver's Phone (optional)"
												type="tel"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-t z-10 w-full">
								<FormButton
									type="submit"
									className="w-full"
									disabled={
										form.formState.isSubmitting ||
										!form.formState.isValid ||
										form.formState.isSubmitSuccessful ||
										!form.formState.isDirty
									}
								>
									{isDeliveryAddress ? "Save and continue" : "Save"}
								</FormButton>
							</div>
						</form>
					</Form>
				</div>
			</ScrollArea>
		</DrawerDialogSwitcher>
	);
}
