import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { AccountPage } from ".";

export const Route = createFileRoute("/(default)/account")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isMobile } = useViewport();
	const { pathname } = useLocation();
	if (isMobile) return <Outlet />;
	return (
		<div className="flex">
			<div className="min-w-[500px] border-r min-h-[calc(100vh-64px)] overflow-y-auto p-8">
				<AccountPage />
			</div>
			{pathname === "/account" ? (
				<div className="flex flex-col items-center justify-center w-full h-full p-8 min-h-[calc(100vh-64px)]">
					<img
						src="/assets/online-store.png"
						alt="Online Store"
						className=" mx-auto aspect-square object-cover hidden lg:block size-96"
					/>
					<p className="text-2xl font-bold">
						Now shop from your own local stores
					</p>
				</div>
			) : (
				<div className="w-full">
					<Outlet />
				</div>
			)}
		</div>
	);
}
