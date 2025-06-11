import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { AccountPage } from ".";

export const Route = createFileRoute("/account")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isMobile } = useViewport();

	const { pathname } = useLocation();

	if (isMobile) return <Outlet />;

	return (
		<div className="flex divide-x min-h-screen relative">
			<div className="flex-1 sticky top-24 overflow-y-auto h-screen">
				<AccountPage />
			</div>
			<div className="flex-3">{pathname !== "/account" && <Outlet />}</div>
		</div>
	);
}
