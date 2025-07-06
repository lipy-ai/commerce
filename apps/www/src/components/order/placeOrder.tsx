import { apiClient } from "@lipy/lib/api";
import { authClient } from "@lipy/lib/providers/auth";
import {
	apiQueryOptions,
	useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import { discordNotification } from "@lipy/server/notification/discord";
import type { addressSchema } from "@lipy/server/routes/address";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@lipy/web-ui/components/ui/dialog";
import { Progress } from "@lipy/web-ui/components/ui/progress";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { StepForward } from "lucide-react";
import { useEffect, useState } from "react";
import type { z } from "zod";
import { useCartStore } from "../cart/store";

function ProgressDialog({
	showDialog,
	setShowDialog,
	deliveryInstruction,
}: {
	showDialog: boolean;
	setShowDialog: (showDialog: boolean) => void;
	deliveryInstruction?: string;
}) {
	const [progress, setProgress] = useState(0);

	const queryClient = useQueryClient();

	const navigate = useNavigate();
	const { data: session } = authClient.useSession();

	const { deliveryLocation } = useLocationStore();
	const { cart } = useCartStore();

	const clearCartMutation = useAPIMutation(apiClient.v1.cart, "$delete", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueryOptions(apiClient.v1.cart, "$get", {}).queryKey,
			});
		},
	});

	const mutation = useAPIMutation(apiClient.v1.order, "$post", {
		onSuccess: async (data: {
			orders: string[];
		}) => {
			setShowDialog(false);

			await clearCartMutation.mutateAsync({});

			if (data.orders.length > 1) {
				navigate({
					to: "/account/orders",
				});
			} else if (data.orders.length === 1) {
				navigate({
					to: `/account/orders/${data.orders[0]}`,
				});
			}
			discordNotification({
				type: "orderPlaced",
				fields: [
					{
						name: "Order ID",
						value: data.orders.toString(),
					},
					{
						name: "Customer",
						value: session?.user.email || session?.session.userId || "",
					},
					{
						name: "Total Bill",
						value: `₹ ${cart.reduce(
							(sum, item) => sum + Number(item.price ?? 0),
							0,
						)}`,
					},
					{
						name: "Delivery Address",
						value: `${deliveryLocation?.metadata?.building}, ${deliveryLocation?.line1}`,
					},
				],
			});
		},

		onError: () => {
			toast.error("Failed to place order", {
				description: "Something went wrong while placing your order.",
			});
		},
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					return 100;
				}
				return prev + 1;
			});
		}, 100); // run for 10s

		const timeout = setTimeout(() => {
			mutation.mutateAsync({
				json: {
					address: deliveryLocation as z.infer<typeof addressSchema>,
					deliveryInstruction: deliveryInstruction || "",
					storeInstruction: null,
				},
			});
		}, 10000);

		// Cleanup
		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [deliveryLocation, deliveryInstruction]);

	return (
		<Dialog open={showDialog} onOpenChange={setShowDialog}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle />
					<DialogDescription className="flex justify-start">
						Placing order...
					</DialogDescription>
					<Progress value={progress} />
				</DialogHeader>
				<div className="flex justify-end mt-4">
					<Button variant="outline" onClick={() => setShowDialog(false)}>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default function PlaceOrder({
	setOpen,
	deliveryInstruction,
}: { setOpen: (open: boolean) => void; deliveryInstruction?: string }) {
	const { data } = authClient.useSession();
	const [showDialog, setShowDialog] = useState(false);
	const { deliveryLocation } = useLocationStore();

	const handlePlaceOrder = () => {
		if (!data) {
			toast("You are not logged in", {
				description: "Please log in to place an order",
				action: (
					<Button
						onClick={() => {
							window.location.href = "/login";
						}}
					>
						Login
					</Button>
				),
			});
		} else {
			if (!deliveryLocation?.metadata?.building) {
				toast("Please give delivery location details.");
				setOpen(true);
			} else {
				setShowDialog(true);
			}
		}
	};

	return (
		<>
			<div className="flex items-center gap-4 my-2">
				<div className="flex-1 text-center">
					<p className="font-medium">Pay Cash/UPI</p>
					<p>(on delivery)</p>
				</div>
				<Button onClick={handlePlaceOrder} className="flex-2" size="lg">
					Place Order
					<StepForward className="fill-card" />
				</Button>
			</div>

			{showDialog && (
				<ProgressDialog
					showDialog={showDialog}
					setShowDialog={setShowDialog}
					deliveryInstruction={deliveryInstruction}
				/>
			)}
		</>
	);
}
