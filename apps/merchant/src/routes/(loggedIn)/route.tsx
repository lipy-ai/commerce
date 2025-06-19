import { ShopCreateForm } from "@/components/shopCreateForm";
import { authClient } from "@lipy/lib/providers/auth";
import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

import {
	CircleUser,
	Home,
	LayoutDashboard,
	LogOut,
	MessageCircleQuestion,
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

// Helper function to get page title based on pathname
const getPageTitle = (pathname: string): string => {
	const pathMap: Record<string, string> = {
		"/": "Dashboard",
		"/store": "My Store",
		"/store/staff": "My Staff",
		"/product": "Products",
		"/order": "Orders",
		"/customer": "Customers",
		"/account": "Account",
	};

	// Remove trailing slash for comparison
	const normalizedPath =
		pathname.endsWith("/") && pathname !== "/"
			? pathname.slice(0, -1)
			: pathname;

	return pathMap[normalizedPath] || "Dashboard";
};

function RouteComponent() {
	const { isMobile } = useViewport();
	const { pathname } = useLocation();

	const { data: activeOrg, isPending: activeOrgPending } =
		authClient.useActiveOrganization();
	const { data: organizations, isPending: orgPending } =
		authClient.useListOrganizations();

	// Show loading spinner while data is being fetched
	if (activeOrgPending || orgPending) {
		return <Spinner />;
	}

	// Handle organization setup
	if (!activeOrg) {
		if (organizations && organizations.length > 0) {
			// Set the first organization as active
			authClient.organization.setActive({
				organizationId: organizations[0].id,
			});
			return <Spinner />; // Show spinner while setting active org
		}
		return <ShopCreateForm />;
	}

	return (
		<DashboardLayout
			dashboardNav={dashboardNav}
			mobileNav={mobileNav}
			logo={{
				icon: "/logo/ico.svg",
				full: "/logo/ico.svg",
				alt: "Logo",
			}}
			activeOrgData={activeOrg}
		>
			<DashboardBody>
				{!isMobile && (
					<header className="sticky top-0 z-10 w-full p-3 px-4 bg-background border-b h-14 flex items-center justify-between">
						<h1 className="text-xl font-medium">{getPageTitle(pathname)}</h1>
						<Button variant="ghost" className="font-medium">
							<MessageCircleQuestion className="w-4 h-4 mr-2" />
							Help
						</Button>
					</header>
				)}
				<Outlet />
			</DashboardBody>
		</DashboardLayout>
	);
}
