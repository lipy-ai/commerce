import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";

import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/useQueryClient";

import { env } from "@envClient";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
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
import { useEffect } from "react";

export const Route = createFileRoute("/(loggedIn)")({
	component: RouteComponent,
});

// Navigation configuration
export const dashboardNav = {
	primary: [
		{
			label: "My Dashboard",
			url: "/",
			icon: LayoutDashboard,
		},
		{
			label: "Products",
			url: "/product",
			icon: Shirt,
		},
		{
			label: "Orders",
			url: "/order",
			icon: ShoppingBag,
		},
		{
			label: "Customers",
			url: "/customer",
			icon: Users,
		},
	],
	secondary: [
		{
			label: "Account",
			url: "/account",
			icon: Settings,
		},
		{
			label: "Sign out",
			url: "/logout",
			icon: LogOut,
		},
	],
};

const mobileNav = [
	{
		label: "Home",
		url: "/",
		icon: Home,
	},
	{
		label: "Products",
		url: "/product",
		icon: Shirt,
	},
	{
		label: "Orders",
		url: "/order",
		icon: ShoppingBag,
	},
	{
		label: "Customers",
		url: "/customer",
		icon: Users,
	},
	{
		label: "Account",
		url: "/account",
		icon: CircleUser,
	},
];

function RouteComponent() {
	const store = useAPIQuery(apiClient.v1.merchant.store, "$get", {});
	// const org = authClient.useActiveOrganization();

	useEffect(() => {
		if (!store.isLoading && !store.data) {
			redirect({
				href: `${env.WEB_URL}/login?cb=${encodeURI(window.location.href)}`,
			});
		}
	}, [store]);

	return (
		<DashboardLayout
			dashboardNav={dashboardNav}
			mobileNav={mobileNav}
			logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
		>
			<DashboardBody>
				{store.isLoading ? (
					<div className="flex flex-col flex-1">
						<Skeleton className="flex-1 m-8" />
					</div>
				) : (
					<Outlet />
				)}
			</DashboardBody>
		</DashboardLayout>
	);
}
