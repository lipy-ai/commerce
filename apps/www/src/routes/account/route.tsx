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
		<div className="flex h-[calc(100vh-6rem)]">
			{" "}
			{/* 6rem = top-24 */}
			{/* Left panel - sticky and scrollable if needed */}
			<div className="w-[400px] shrink-0 border-r overflow-y-auto sticky top-24 h-[calc(100vh-6rem)]">
				<AccountPage />
			</div>
			{/* Right panel - scrollable area */}
			<div className="flex-1 overflow-y-auto min-h-0 ">
				{pathname !== "/account" && <Outlet />}
			</div>
		</div>
	);
}
