import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

import { authClient } from "@lipy/lib/providers/auth";

import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";

import { Spinner } from "@lipy/web-ui/components/ui/spinner";

import { ShopCreateForm } from "@/components/shopCreateForm";
import { Button } from "@lipy/web-ui/components/ui/button";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
//
import {
	CircleUser,
	Home,
	LayoutDashboard,
	LogOut,
	LucideMessageCircleQuestion,
	Settings,
	Shirt,
	ShoppingBag,
	Users,
} from "lucide-react";

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
	const { isMobile } = useViewport();
	const { pathname } = useLocation();
	const { data: activeOrg, isPending } = authClient.useActiveOrganization();

	if (isPending) return <Spinner />;

	if (!isPending && !activeOrg) return <ShopCreateForm />;

	console.log(pathname);

	return (
		<DashboardLayout
			dashboardNav={dashboardNav}
			mobileNav={mobileNav}
			logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
			activeOrgData={activeOrg}
		>
			<DashboardBody>
				{!isMobile && (
					<div className="sticky top-0 z-10  gap-8 w-full p-3 px-4 bg-background border-b h-14 flex items-center justify-between">
						<p className="text-xl font-medium ">
							{pathname.endsWith("/")
								? "Dashboard"
								: pathname.endsWith("/store")
									? "My Store" :
									pathname.endsWith("/store/staff") ?
									"My staff"
									: ""}
						</p>
						<div>
							<Button variant={"ghost"} className="font-medium">
								<LucideMessageCircleQuestion />
								Help
							</Button>
						</div>
					</div>
				)}

				<Outlet />
			</DashboardBody>
		</DashboardLayout>
	);
}
