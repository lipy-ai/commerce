import { zodResolver } from "@hookform/resolvers/zod";
// @ts-nocheck
import { apiClient } from "@lipy/lib/api";
import { authClient } from "@lipy/lib/providers/auth";
import { apiQueryOptions, useAPIMutation } from "@lipy/lib/utils/queryClient";
import { CustomRadioGroup } from "@lipy/web-ui/components/custom-ui/customRadioGroup";
import { InputWithAnimatedLabel } from "@lipy/web-ui/components/custom-ui/inputWithAnimatedLabel";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, StepForward, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, buttonVariants } from "../ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";
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
}: {
	fullAddress: any;
	label: "Edit" | "Add";
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const { data } = authClient.useSession();
	const { isMobile } = useViewport();
	let building = "";
	if (label === "Edit") {
		building = fullAddress.line1.split(",")[0];
	}
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const formSchema = z.object({
		building: z.string().min(2, {
			message: "Please fill your detailed address",
		}),
		addressType: z.enum(["home", "work", "other"]),
		receiverName: z.string().optional(),
		receiverPhone: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			building: building || "",
			addressType: fullAddress.tag || "home",
			receiverName: fullAddress.name || data?.user?.name || "",
			receiverPhone: fullAddress.phone || "",
		},
	});

	const mutation = useAPIMutation(apiClient.v1.address, "$post", {
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: apiQueryOptions(apiClient.v1.address, "$get", {}).queryKey,
			});

			navigate({ to: "/account/addresses", replace: true });
		},
		onError() {
			toast.error("Something went wrong while adding address");
		},
	});

	const editMutation = useAPIMutation(apiClient.v1.address[":id"], "$patch", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueryOptions(apiClient.v1.address, "$get", {}).queryKey,
			});
			navigate({ to: "/account/addresses", replace: true });
			onOpenChange?.(false);
		},
		onError: () => {
			toast.error("Something went wrong while editing address");
		},
	});

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		if (label === "Add") {
			mutation.mutateAsync({
				json: {
					name: values.receiverName || fullAddress.name,
					country: fullAddress.country,
					tag: values.addressType,
					line1: `${values.building}, ${fullAddress.address}`,
					line2: "",
					city: fullAddress.city,
					state: fullAddress.state,
					postalCode: fullAddress.postalCode,
					phone: values.receiverPhone,
					lat: fullAddress.lat,
					lng: fullAddress.lng,
				},
			});
		} else if (label === "Edit") {
			editMutation.mutateAsync({
				param: { id: fullAddress.id },
				json: {
					name: values.receiverName || fullAddress.name,
					country: fullAddress.country,
					tag: values.addressType,
					line1: `${values.building}, ${fullAddress.line1.split(",").slice(1).join(",")}`,
					line2: "",
					city: fullAddress.city,
					state: fullAddress.state,
					postalCode: fullAddress.postalCode,
					phone: values.receiverPhone,
					lat: fullAddress.lat,
					lng: fullAddress.lng,
				},
			});
		}
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerTrigger
				className={cn(isMobile && label === "Add" ? "w-full" : " ")}
			>
				{label === "Add" && (
					<Button className="font-semibold px-6 w-full">
						Confirm this address
						<StepForward className="ml-2 h-4 w-4" />
					</Button>
				)}
			</DrawerTrigger>

			<DrawerContent>
				<ScrollArea className="overflow-y-auto">
					<DrawerHeader className="p-4">
						<div className="flex items-center justify-between">
							<DrawerTitle className="font-semibold text-lg">
								Add address details
							</DrawerTitle>
							<DrawerDescription />
							<DrawerClose>
								<X className="h-5 w-5" />
							</DrawerClose>
						</div>
					</DrawerHeader>

					<Separator />

					<div className="p-4 mb-6">
						<div className="text-sm rounded-md border p-2 bg-accent font-medium">
							{label === "Edit" ? (
								<p>{fullAddress.line1.split(",").slice(1).join(",")}</p>
							) : label === "Add" ? (
								<p>{fullAddress.address}</p>
							) : (
								<></>
							)}
							<div className="flex justify-end">
								{label === "Add" ? (
									<DrawerClose>
										<Button size="sm" variant="outline" className="ml-auto">
											Change
										</Button>
									</DrawerClose>
								) : label === "Edit" ? (
									<Link
										className={cn(
											buttonVariants({ variant: "outline", size: "sm" }),
											"ml-auto",
										)}
										to="/account/addresses/new"
										search={{ type: "saveAddress" }}
									>
										Change
									</Link>
								) : (
									<></>
								)}
							</div>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(handleSubmit)}
								className="space-y-8 my-8 w-full"
							>
								<FormField
									control={form.control}
									name="building"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<InputWithAnimatedLabel
													title={"Flat No. / House No. / Building Name *"}
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
												<CustomRadioGroup
													{...field}
													items={addressTypesItems}
												/>
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
													title={"Receiver's Name"}
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
													title={"Receiver's Phone"}
													type=""
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="font-semibold w-full"
									disabled={
										form.formState.isSubmitting ||
										!form.formState.isValid ||
										form.formState.isSubmitSuccessful ||
										!form.formState.isDirty
									}
								>
									{form.formState.isSubmitting ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Saving...
										</>
									) : (
										"Save Address"
									)}
								</Button>
							</form>
						</Form>
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	);
}
