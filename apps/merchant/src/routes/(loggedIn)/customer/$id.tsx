import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/customer/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	// const { data } = useAPIQuery(apiClient.v1.address, "$get", {});
	return (
		<div>
			<DashboardHeader title="Edit Customer" />
			Hello "/(loggedIn)/products/"!
		</div>
	);
}
