import { apiClient } from "@lipy/lib/api/index.js";
import { useAPIMutation } from "@lipy/lib/utils/queryClient.js";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@lipy/web-ui/components/ui/button";
import { toast } from "@lipy/web-ui/components/ui/sonner";

export const Route = createFileRoute("/demo/tanstackMutation")({
	component: RouteComponent,
});

function RouteComponent() {
	const mutation = useAPIMutation(apiClient.v1.address, "$post");

	const handle = () => {
		toast.promise(
			mutation.mutateAsync({
				json: {
					name: "string",
					country: "string",
					tag: "home",
					line1: "string",
					line2: "string",
					city: "string",
					state: "string",
					postal_code: "string",
				},
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
