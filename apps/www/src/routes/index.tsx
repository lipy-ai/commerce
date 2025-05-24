import NavBar from "@/components/navBar";
import NearByShops from "@/components/nearbyShops";
import { SearchFilter } from "@/components/searchFilter";
import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import LocationComponent from "@lipy/web-ui/components/maps/deliveryAddress";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import { CircleUser, LogOut, ShoppingCart, Store } from "lucide-react";

export const Route = createFileRoute("/")({
	component: Home,
});

export const dashboardNav = {
	primary: [
		{
			label: "Shops Near me",
			url: "/",
			icon: Store,
		},
		{
			label: "Cart",
			url: "/account/profile",
			icon: ShoppingCart,
		},
	],
	secondary: [
		{
			label: "Account",
			url: "/account",
			icon: CircleUser,
		},
		{ label: "Sign out", url: "/logout", icon: LogOut },
		// { label: "Help", url: "/help", icon: CircleHel },
	],
};

const mobileNav = [
	{
		label: "Shops Near me",
		url: "/",
		icon: Store,
	},
	{
		label: "Cart",
		url: "/account/profile",
		icon: ShoppingCart,
	},
];

function Home() {
	return (
		<>
			<DashboardLayout
				dashboardNav={dashboardNav}
				mobileNav={mobileNav}
				logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
			>
				<DashboardBody>
					<div className="relative bg-gradient-to-b from-primary/50 to-primary/40">
						<NavBar />
					</div>
					<div className="bg-gradient-to-b from-primary/40 to-white sticky top-0 z-20 shadow-sm transition-colors duration-300 backdrop-blur-lg">
						<SearchFilter />
					</div>
					<NearByShops />
					<LocationComponent />
				</DashboardBody>
			</DashboardLayout>
		</>
	);
}
