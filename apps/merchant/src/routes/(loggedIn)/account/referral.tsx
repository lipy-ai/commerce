import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/account/referral")({
	component: RouteComponent,
});
function RouteComponent() {
	return (
		<div>
			<DashboardHeader title="Refer and Earn" />
		</div>
	);
}
