import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";

import { env } from "@envClient";
import { authClient } from "@lipy/lib/providers/auth";

import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import {
	CircleUser,
	Home,
	LayoutDashboard,
	LogOut,
	Settings,
	Shirt,
	ShoppingBag,
	Users,
} from "lucide-react";

export const Route = createFileRoute("/(loggedIn)")({
	component: RouteComponent,
});

// Navigation configuration
export const dashboardNav = {
	primary: [
		{ label: "My Dashboard", url: "/", icon: LayoutDashboard },
		{ label: "Products", url: "/product", icon: Shirt },
		{ label: "Orders", url: "/order", icon: ShoppingBag },
		{ label: "Customers", url: "/customer", icon: Users },
	],
	secondary: [
		{ label: "Account", url: "/account", icon: Settings },
		{ label: "Sign out", url: "/logout", icon: LogOut },
	],
};

const mobileNav = [
	{ label: "Home", url: "/", icon: Home },
	{ label: "Products", url: "/product", icon: Shirt },
	{ label: "Orders", url: "/order", icon: ShoppingBag },
	{ label: "Customers", url: "/customer", icon: Users },
	{ label: "Account", url: "/account", icon: CircleUser },
];

function RouteComponent() {
	const { isPending, data } = authClient.useSession();
	const { pathname } = useLocation();

	if (isPending) {
		return <Spinner />;
	}

	if (!data) {
		// Encode current path as base64 for safe URL transmission
		const encodedCallback = btoa(window.location.href);

		window.location.href = `${env.WEB_URL}/login?cb=${encodedCallback}`;
		return null;
	}

	if (pathname.includes("newStore") || pathname.includes("accept-invitation"))
		return <Outlet />;

	return (
		<DashboardLayout
			dashboardNav={dashboardNav}
			mobileNav={mobileNav}
			logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
		>
			<DashboardBody>
				<Outlet />
			</DashboardBody>
		</DashboardLayout>
	);
}
