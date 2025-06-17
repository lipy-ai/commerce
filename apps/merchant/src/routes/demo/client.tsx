import { apiClient } from "@lipy/lib/api/index.js";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/client")({
	component: RouteComponent,
});

function RouteComponent() {
	const data = useAPIQuery(apiClient.v1.merchant.store, "$get", { query: {} });

	return (
		<pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
	);
}
