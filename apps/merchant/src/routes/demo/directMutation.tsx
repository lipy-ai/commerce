import { apiClient } from "@lipy/lib/api/index.js";
import { Button } from "@lipy/web-ui/components/ui/button";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/directMutation")({
	component: RouteComponent,
});

function RouteComponent() {
	const handle = () => {
		toast.promise(
			// apiClient.v1.address.$post({
			//   json: {
			//     name: "string",
			//     country: "string",
			//     tag: "home",
			//     line1: "string",
			//     line2: "string",
			//     city: "string",
			//     state: "string",
			//     postal_code: "string",
			//   },
			// }),
			// apiClient.v1.address[":id"].$delete({
			// 	param: { id: "23de9ed4-0d5f-4be5-bfb8-5a62c9fbe532" },
			// }
			apiClient.v1.cart.$patch({
				json: { variant_id: "id", quantity: 1 },
			}),
			{
				success: "Success",
				error: "Error",
				loading: "Saving",
			},
		);
	};

	return (
		<div className="p-8">
			<p>This will save address:</p>
			<div>
				<Button onClick={handle}>Save Mutation</Button>
			</div>
		</div>
	);
}
