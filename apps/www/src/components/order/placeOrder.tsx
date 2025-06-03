import { apiClient } from "@lipy/lib/api";
import { authClient } from "@lipy/lib/providers/auth";
import { apiQueryOptions, useAPIMutation } from "@lipy/lib/utils/queryClient";
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
import { useCartStore } from "../cart/store";

function ProgressDialog({
	showDialog,
	setShowDialog,
}: {
	showDialog: boolean;
	setShowDialog: (showDialog: boolean) => void;
}) {
	const [progress, setProgress] = useState(0);

	const queryClient = useQueryClient();

	const navigate = useNavigate();

	const { setInitialized } = useCartStore();

	const clearCartMutation = useAPIMutation(apiClient.v1.cart, "$delete", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: apiQueryOptions(apiClient.v1.cart, "$get", {}).queryKey,
			});
		},
	});

	const mutation = useAPIMutation(apiClient.v1.order, "$post", {
		onSuccess: () => {
			setShowDialog(false);

			clearCartMutation.mutateAsync({});

			setInitialized(false);

			navigate({
				to: "/account/orders",
			});
		},

		onError: () => {
			toast.error("Failed to place order", {
				description: "Something went wrong while placing your order.",
			});
		},
	});

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
					address: "6b5748e4-c383-408f-a052-488636cfacf4",
					deliveryInstruction: "Kaise bhi kar de deliver",
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

export default function PlaceOrder() {
	const { data } = authClient.useSession();
	const [showDialog, setShowDialog] = useState(false);
	// const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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
			setShowDialog(true);
		}
	};

	return (
		<>
			<Button onClick={handlePlaceOrder}>
				<p>Place Order</p>
				<StepForward />
			</Button>

			{showDialog && (
				<ProgressDialog showDialog={showDialog} setShowDialog={setShowDialog} />
			)}

			{/* {showSuccessDialog && (
				<OrderSuccessful
					showSuccessDialog={showSuccessDialog}
					setShowSuccessDialog={setShowSuccessDialog}
				/>
			)} */}
		</>
	);
}
