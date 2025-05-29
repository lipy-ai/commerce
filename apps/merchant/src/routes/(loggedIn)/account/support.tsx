import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/account/support")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<DashboardHeader title="Customer Support" />
		</div>
	);
}
