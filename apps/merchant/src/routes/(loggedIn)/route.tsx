import { env } from "@envClient";
import { getSsrSession } from "@lipy/lib/providers/auth";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getHeaders, getWebRequest } from "@tanstack/react-start/server";

import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
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
import { cache } from "react";

export const authFn = createServerFn({ method: "GET" }).handler(
	cache(async (d) => {
		const request = getWebRequest();
		const h = getHeaders();

		const res = await getSsrSession(request?.headers);

		if (!res?.session) {
			const cb = h.referer || env.MERCHANT_URL;

			redirect({
				href: `${env.WEB_URL}/login?cb=${cb}` as any,
				throw: true,
			});
		}

		return res;
	}),
);

export const Route = createFileRoute("/(loggedIn)")({
	component: RouteComponent,
	// loader: async () => {
	// 	const result = await authFn();
	// 	return result;
	// },
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
	// const data = Route.useLoaderData();

	return (
		<main>
			<DashboardLayout
				dashboardNav={dashboardNav}
				mobileNav={mobileNav}
				logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
			>
				<DashboardBody>
					<Outlet />
				</DashboardBody>
			</DashboardLayout>
		</main>
	);
}
