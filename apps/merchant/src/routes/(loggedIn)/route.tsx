import { authClient } from "@lipy/lib/providers/auth";
import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import { Spinner } from "@lipy/web-ui/components/ui/spinner";
import {
	Outlet,
	createFileRoute,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";

import ErrorPage from "@lipy/web-ui/components/pages/error";
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
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const {
		data: activeOrg,
		isPending: activeOrgPending,
		error,
		refetch,
		isRefetching,
	} = authClient.useActiveOrganization();

	if (activeOrgPending || isRefetching) {
		return <Spinner />;
	}

	if (error) {
		return (
			<ErrorPage
				title={`Error : ${error.status}`}
				message={error.message || error.statusText || "Something went wrong"}
				reset={refetch}
			/>
		);
	}

	if (!activeOrgPending && !activeOrg) {
		navigate({ to: "/newStore" });
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
			isVisibleDashboarNav={pathname !== "/newStore"}
		>
			<DashboardBody>
				<Outlet />
			</DashboardBody>
		</DashboardLayout>
	);
}
