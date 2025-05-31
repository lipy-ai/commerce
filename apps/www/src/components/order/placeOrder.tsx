import { authClient } from "@lipy/lib/providers/auth";
import { Button } from "@lipy/web-ui/components/ui/button";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { StepForward } from "lucide-react";

export default function PlaceOrder() {
	const { data } = authClient.useSession();

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
		} else console.log("chalo order karte hai");
	};
	return (
		<>
			<Button onClick={handlePlaceOrder}>
				<p>Place Order</p>
				<StepForward />
			</Button>
		</>
	);
}
