import { env } from "@envClient";
import { Outlet, createFileRoute } from "@tanstack/react-router";

import { apiClient } from "@lipy/lib/api";
import { useAPIQuery } from "@lipy/lib/utils/queryClient";
import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";
//
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
			mobile: true,
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
		{ label: "Sign out", url: "/logout", icon: LogOut },
		// { label: "Help", url: "/help", icon: CircleHel },
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
	const { data, isLoading } = useAPIQuery(
		apiClient.v1.merchant.store,
		"$get",
		{},
	);

	useEffect(() => {
		if (isLoading || data) return;
		console.log(data);
		const cb = window?.location.origin || env.MERCHANT_URL;
		window.location.href = `${env.WEB_URL}/login?cb=${btoa(cb)}`;
	}, [isLoading, data]);

	return (
		<main>
			<DashboardLayout
				dashboardNav={dashboardNav}
				mobileNav={mobileNav}
				logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
			>
				<DashboardBody>
					{isLoading ? (
						<div className="p-4 flex h-screen flex-1">
							<Skeleton className="flex-1" />
						</div>
					) : (
						<Outlet />
					)}
				</DashboardBody>
			</DashboardLayout>
		</main>
	);
}
