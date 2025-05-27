import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cart")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading } = useAPIQuery(apiClient.v1.cart, "$get", {});
	return (
		<>
			<pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
		</>
	);
}
