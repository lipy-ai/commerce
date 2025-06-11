// import { HorizontalNav } from "@lipy/web-ui/components/nav/horizontal";

import { authClient } from "@lipy/lib/providers/auth";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
// import { authClient } from "@lipy/lib/providers/auth";
import VerticalListSkeleton from "@lipy/web-ui/components/layouts/skeletons/verticalListSkeleton";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/account")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isPending } = authClient.useSession();

	if (isPending) {
		return (
			<div>
				<DashboardHeader />
				<div className="p-4 lg:p-8 max-w-4xl">
					<VerticalListSkeleton count={8} />
				</div>
			</div>
		);
	}

	return <Outlet />;
}
