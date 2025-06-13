import { AppCartInitializer } from "@/components/cart/appCartInitializer";
import { useCartStore } from "@/components/cart/store";
import NavBar from "@/components/navBar";
import NearByShops from "@/components/nearbyShops";
import {
	DashboardBody,
	DashboardLayout,
} from "@lipy/web-ui/components/layouts/dashboard";
import LocationComponent from "@lipy/web-ui/components/maps/deliveryAddress";
import { useLocationStore } from "@lipy/web-ui/components/maps/utils/store";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import {
	CircleUser,
	LogOut,
	type LucideIcon,
	ShoppingCart,
	Store,
} from "lucide-react";

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
	],
};

function Home() {
	const { cart, initialized } = useCartStore();

	const { deliveryLocation, hasHydrated } = useLocationStore();
	const { isMobile } = useViewport();

	const mobileNav = [
		{
			label: "Shops Near me",
			url: "/",
			icon: Store,
			mobile: true,
		},
		{
			label: "Cart",
			url: "/cart",
			icon: () => {
				return (
					<div className="relative inline-block">
						<ShoppingCart className="w-6 h-6 text-gray-700" />
						{cart.length > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
								{cart.length > 99 ? "99+" : cart.length}
							</span>
						)}
					</div>
				) as any as LucideIcon;
			},
			mobile: true,
		} as any,
	];

	return (
		<>
			<DashboardLayout
				dashboardNav={dashboardNav}
				mobileNav={mobileNav}
				logo={{ icon: "/logo/ico.svg", full: "/logo/ico.svg", alt: "" }}
				isVisibleDashboarNav={false}
			>
				<DashboardBody>
					{isMobile && <NavBar />}
					<NearByShops />

					{hasHydrated && deliveryLocation.line1 === "" && (
						<LocationComponent />
					)}

					{!initialized && <AppCartInitializer />}
				</DashboardBody>
			</DashboardLayout>
		</>
	);
}
