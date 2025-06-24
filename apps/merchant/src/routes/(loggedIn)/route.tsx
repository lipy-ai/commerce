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
	useRouter,
} from "@tanstack/react-router";

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
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { data, isPending } = authClient.useSession();
	if (isPending) return <Spinner />;

	if (!data) {
		navigate({ to: "/login" });
	}

	if (
		pathname.includes("/accept-invitation") ||
		pathname.includes("/newStore")
	) {
		return <Outlet />;
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
		>
			<DashboardBody>
				<Outlet />
			</DashboardBody>
		</DashboardLayout>
	);
}
