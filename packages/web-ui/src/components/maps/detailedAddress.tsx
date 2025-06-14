import { zodResolver } from "@hookform/resolvers/zod";
// @ts-nocheck
import { apiClient } from "@lipy/lib/api";
import { authClient } from "@lipy/lib/providers/auth";
import { apiQueryOptions, useAPIMutation } from "@lipy/lib/utils/queryClient";
import { CustomRadioGroup } from "@lipy/web-ui/components/custom-ui/customRadioGroup";
import { InputWithAnimatedLabel } from "@lipy/web-ui/components/custom-ui/inputWithAnimatedLabel";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DrawerDialogSwitcher } from "../custom-ui/drawerDialogSwitcher";
import { Button, buttonVariants } from "../ui/button";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
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
	const navigate = useNavigate();
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
			navigate({ to: "/account/addresses", replace: true });
			onOpenChange?.(false);
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
						<p>
							{label === "Edit"
								? fullAddress.line1.split(",").slice(1).join(",")
								: fullAddress.line1}
						</p>
						<div className="flex justify-end">
							{label === "Add" ? (
								<Button variant="outline" size="sm">
									Change
								</Button>
							) : (
								<Link
									to="/account/addresses/new"
									search={{ type: "saveAddress" }}
									className={cn(
										buttonVariants({ variant: "outline", size: "sm" }),
									)}
								>
									Change
								</Link>
							)}
						</div>
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

							<div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-t z-10">
								<Button
									type="submit"
									className="w-full font-semibold"
									disabled={
										form.formState.isSubmitting ||
										!form.formState.isValid ||
										form.formState.isSubmitSuccessful ||
										!form.formState.isDirty
									}
								>
									{form.formState.isSubmitting ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin mr-2" />
											Saving...
										</>
									) : isDeliveryAddress ? (
										"Save and continue"
									) : (
										"Save Address"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</ScrollArea>
		</DrawerDialogSwitcher>
	);
}
