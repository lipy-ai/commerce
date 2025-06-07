import { apiClient } from "@lipy/lib/api";
import { authClient } from "@lipy/lib/providers/auth";
import { apiQueryOptions, useAPIMutation } from "@lipy/lib/utils/queryClient";
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

	const { deliveryLocation } = useLocationStore();

	const clearCartMutation = useAPIMutation(apiClient.v1.cart, "$delete", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueryOptions(apiClient.v1.cart, "$get", {}).queryKey,
			});
		},
	});

	const mutation = useAPIMutation(apiClient.v1.order, "$post", {
		onSuccess: (data: {
			orders: string[];
		}) => {
			setShowDialog(false);

			clearCartMutation.mutateAsync({});

			if (data.orders.length > 1) {
				navigate({
					to: "/account/orders",
				});
			} else if (data.orders.length === 1) {
				navigate({
					to: `/account/orders/${data.orders[0]}`,
				});
			}
		},

		onError: () => {
			toast.error("Failed to place order", {
				description: "Something went wrong while placing your order.",
			});
		},
	});
	const { id, userId, ...addressWithoutIdAndUserId } = deliveryLocation;

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
					address: addressWithoutIdAndUserId,
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
	}, []);

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
			if (!deliveryLocation.id) {
				toast("Please give delivery location details.");
				setOpen(true);
			} else {
				setShowDialog(true);
			}
		}
	};

	return (
		<>
			<Button onClick={handlePlaceOrder} variant="green">
				<p>Place Order</p>
				<StepForward />
			</Button>

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
