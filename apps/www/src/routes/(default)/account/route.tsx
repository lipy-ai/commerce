import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { AccountPage } from "./-account";

export const Route = createFileRoute("/(default)/account")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isMobile } = useViewport();
	const { pathname } = useLocation();

	if (isMobile) return <Outlet />;

	return (
		<div className="lg:grid lg:grid-cols-12 h-screen">
			{/* Left Sidebar */}
			<div className="lg:col-span-3 border-r overflow-y-auto sticky top-0 h-screen p-8">
				<AccountPage />
			</div>

			{/* Right Content Area */}
			<div className="lg:col-span-9 overflow-y-auto h-screen">
				{pathname === "/account" ? (
					<div className="flex flex-col items-center justify-center p-8 m-auto">
						<img
							src="/assets/online-store.png"
							alt="Online Store"
							className="mx-auto aspect-square object-cover hidden lg:block size-96"
						/>
						<p className="text-2xl font-bold">
							Now shop from your own local stores
						</p>
					</div>
				) : (
					<Outlet />
				)}
			</div>
		</div>
	);
}
