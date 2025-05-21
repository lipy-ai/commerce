import { apiClient } from "@lipy/lib/api/index.js";
import { useAPIQuery } from "@lipy/lib/utils/queryClient.js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/order/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = useAPIQuery(apiClient.v1.address, "$get", {});
	return <div>Hello "/(loggedIn)/products/"!</div>;
}
